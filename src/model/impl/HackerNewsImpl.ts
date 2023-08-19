/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : HackerNewsImpl.ts
 *   Last Modified : 2023-08-10 10:50:28
 *   Describe      :
 *
 * ====================================================
 */
import { PathLike } from "fs";
import { HackerNewsDAO } from "../DAO/HackerNewsDAO";
import { HackerNews } from "../beam/HackerNews";
import { BaseDAO } from "../base/BaseDAO";
import path from "path";
import { JsonData } from "../../common/type";

export class HackerNewsImpl extends BaseDAO implements HackerNewsDAO {
	get HackerNewsMap(): Record<string, HackerNews> {
		return this.tranformListToMap(this.HackerNewsList);
	}

	get HackerNewsList(): HackerNews[] {
		const jsonPath = path.join(__dirname, "../../data/data.json");
		const jsonData: JsonData = this.readData(jsonPath);
		const jsonList = Object.values(jsonData);
		const hnlist: HackerNews[] = [] as HackerNews[];
		jsonList.forEach((v, _) => {
			hnlist.push(new HackerNews(v.bvid, v.title, v.aid, v.pubdate, v.source));
		});

		return hnlist;
	}

	tranformListToMap(hackernewsList: HackerNews[]): Record<string, HackerNews> {
		const hackernewsMap: Record<string, HackerNews> = {} as {
			[bvid: string]: HackerNews;
		};
		hackernewsList.forEach((element, _) => {
			hackernewsMap[element.Bvid] = element;
		});
		return hackernewsMap;
	}

	tranformMapToList(hackernewsMap: Record<string, HackerNews>): HackerNews[] {
		return Object.values(this.HackerNewsMap);
	}

	updateHackerNews(hackernews: HackerNews): boolean {
		let flag = false;
		this.HackerNewsList.forEach((v, idx) => {
			if (v.Bvid === hackernews.Bvid) {
				flag = true;
				this.HackerNewsList[idx] = hackernews;
			}
		});

		return flag;
	}

	saveHackerNews(jsonPath: PathLike, HNs: HackerNews[]): void {
		this.writeData(String(jsonPath), this.tranformListToMap(HNs));
	}

	get Bvids(): string[] | undefined {
		return this.HackerNewsList.map((v, _) => v.Bvid);
	}
}
