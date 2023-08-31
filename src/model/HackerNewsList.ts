/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : HackerNewsList.ts
 *   Last Modified : 2023-08-25 18:11:41
 *   Describe      :
 *
 * ====================================================
 */

import path from "path";
import { JsonData } from "@src/common/type";
import { Utils } from "@src/common/utils";
import _ from "underscore";
import { HackerNewsDAO } from "./DAO/HackerNewsDAO";
import { DetailsList } from "./DetailsList";
import { BaseDAO } from "./base/BaseDAO";
import { DetailsBeamer } from "./beamer/DetailsBeamer";
import { HackerNewsBeamer } from "./beamer/HackerNewsBeamer";

export class HackerNewsList extends BaseDAO implements HackerNewsDAO {
	#databaseDir = path.join(__dirname, '../data/json');
	#details: DetailsList = new DetailsList();


	get DatabaseDir(): string {
		return this.#databaseDir;
	}

	set DatabaseDir(value: string) {
		this.#databaseDir = value;
	}

	async getList(): Promise<HackerNewsBeamer[]> {
		const jsonListFile = await Utils.readDir(this.#databaseDir);
		const hnlist: HackerNewsBeamer[] = [] as HackerNewsBeamer[];

		jsonListFile.sort((a, b) => Number(b.slice(4, 9)) - Number(a.slice(4, 9)))
			.forEach((v, i) => {
				const jsonObj: JsonData = this.readData(path.join(this.#databaseDir, v));
				_.chain(jsonObj)
					.values()
					.each((v, i) => {
						hnlist.push(
							new HackerNewsBeamer(
								v.bvid,
								v.title,
								Number(v.aid),
								v.pubdate,
								v.source,
								this.#details.getList(v.data),
								v.ai
							),
						);
					});
			});

		return hnlist;
	}

	async getMap(): Promise<Map<string, HackerNewsBeamer>> {
		const jsonListFile = await Utils.readDir(this.#databaseDir);

		const hnmap: Map<string, HackerNewsBeamer> = new Map<string, HackerNewsBeamer>();
		jsonListFile.forEach((v, i) => {
			const jsonObj: JsonData = this.readData(path.join(this.#databaseDir, v));
			_.chain(jsonObj)
				.values()
				.each((v, i) => {
					hnmap.set(
						v.bvid,
						new HackerNewsBeamer(
							v.bvid,
							v.title,
							Number(v.aid),
							v.pubdate,
							v.source,
							this.#details.getList(v.data),
						),
					);
				})
		})
		return hnmap;
	};


	getObj(hnlist: HackerNewsBeamer[]): JsonData {
		const jsonObj: JsonData = {};

		hnlist.forEach((v, _) => {
			jsonObj[v.Bvid] = {
				title: v.Title,
				aid: v.Aid,
				bvid: v.Bvid,
				pubdate: v.Pubdate,
				data: this.#details.getObj(v.Details as DetailsBeamer[]),
				source: v.Source as string[],
				ai: v.Ai,
			};
		});

		return jsonObj;
	}

	#groupDatabase(hnlist: HackerNewsBeamer[]): _.Dictionary<HackerNewsBeamer[]> {
		return _.groupBy(hnlist, (v) => `${v.fmtPubdate.getFullYear()}`);
	}

	async updateList(hnlist: HackerNewsBeamer[], hn: HackerNewsBeamer): Promise<void> {
		try {
			if (hn.Bvid) {
				hnlist.push(hn);
			}
			else {
				console.warn(`maybe the update item: ${hn} is null`);
			}

			const sortHNList = hnlist.sort((a, b) => b.compareTo(a));
			_.chain(this.#groupDatabase(sortHNList))
				.each((v, k) =>
					this.writeData(
						path.join(this.#databaseDir, `data${k}.json`),
						this.getObj(v)
					))
				.value();
		} catch (error) {
			throw new Error(`${error}`);
		}
	};
}
