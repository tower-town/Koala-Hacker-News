/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : Collect.ts
 *   Last Modified : 2023-08-25 19:54:17
 *   Describe      :
 *
 * ====================================================
 */

import _ from "underscore";
import { Utils, fetchJson } from "../../common/utils";
import { HackerNewsList } from "../../model/HackerNewsList";
import { HackerNews } from "../../model/beamer/HackerNews";
import { ServiceBaseDAO } from "../base/ServiceBase";
import { BvidData } from "../../common/type";

export class Collect extends ServiceBaseDAO {
	initUrl(): URL {
		const api_data = this.data.collect;
		const url = new URL(api_data.url);
		const params = new URLSearchParams(api_data.params);

		return Utils.parseUrl(url, params)
	}

	checkData(): boolean {
		return true;
	}

	async updateData<U, V>(u: U, v: V): Promise<void> {
		try {
			const hnlist = await u as HackerNews[];
			const hn = v as HackerNews;
			new HackerNewsList().updateList(hnlist, hn);
		} catch (error) {
			throw new Error(`${error}`)

		}
	}

	#getDataSet(data: Record<string, unknown>): BvidData {
		return {
			title: data.title,
			aid: data.aid,
			bvid: data.bvid,
			pubdate: data.pubdate,
		} as BvidData;
	}

	async init(): Promise<void> {
		const hnlist = await this.loadData();
		_.chain([this.initUrl()])
			.map((url) => fetchJson(url))
			.map((promise) => promise.then((data) => {
				const dataset: Record<string, unknown>[] = data.data.archives;
				return _.map(dataset, (data) => this.#getDataSet(data));
			}))
			.map((promise) =>
				promise.then((data) =>
					data.sort((a, b) => b.pubdate - a.pubdate)
						.map((data) => async () => {
							await this.updateData(
								hnlist,
								new HackerNews(data.bvid,
									data.title,
									data.aid,
									data.pubdate)
							)
						})
				)
			)
			.value();

	}
}
