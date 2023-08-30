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
import { HackerNewsDAO } from "./DAO/HackerNewsDAO";
import { DetailsList } from "./DetailsList";
import { BaseDAO } from "./base/BaseDAO";
import { DetailsBeamer } from "./beamer/DetailsBeamer";
import { HackerNewsBeamer } from "./beamer/HackerNewsBeamer";

export class HackerNewsList extends BaseDAO implements HackerNewsDAO {
	#pathjson: string = path.join(__dirname, "../data/data.json");
	#details: DetailsList = new DetailsList();

	get Pathjson(): string {
		return this.#pathjson;
	}

	set Pathjson(value: string) {
		this.#pathjson = value;
	}

	getList(): Promise<HackerNewsBeamer[]> {
		return new Promise((resolve, reject) => {
			const jsonObj: JsonData = this.readData(this.#pathjson);

			const jsonList = Object.values(jsonObj);
			const hnlist: HackerNewsBeamer[] = [] as HackerNewsBeamer[];

			jsonList.forEach((v, _) => {
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
			resolve(hnlist);
		});
	}
	getMap(): Promise<Map<string, HackerNewsBeamer>> {
		return new Promise((resolve, reject) => {
			const jsonObj: JsonData = this.readData(this.#pathjson);

			const jsonList = Object.values(jsonObj);
			const hnmap: Map<string, HackerNewsBeamer> = new Map<string, HackerNewsBeamer>();

			jsonList.forEach((v, _) => {
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
			});
			resolve(hnmap);
		});
	}


	#getObj(hnlist: HackerNewsBeamer[]): JsonData {
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

	async updateList(hnlist: HackerNewsBeamer[], hn: HackerNewsBeamer): Promise<void> {
		try {
			hnlist.forEach((v, _) => {
				hnlist.push(hn);
			});

			const sort_hnlist = hnlist.sort((a, b) => b.Pubdate - a.Pubdate)
			await this.writeData(this.#pathjson, this.#getObj(sort_hnlist));
		} catch (error) {
			throw new Error(`${error}`);
		}
	};
}
