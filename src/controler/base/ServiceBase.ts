/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : ServiceBaseDAO.ts
 *   Last Modified : 2023-08-10 10:24:49
 *   Describe      :
 *
 * ====================================================
 */

import { HackerNewsList } from "../../model/HackerNewsList";
import { HackerNews } from "../../model/beamer/HackerNews";
import { ApiBase, ApiData } from "./ApiBase";

export abstract class ServiceBaseDAO {
	data: ApiData = ApiBase.init();

	abstract initUrl(params: string | number): URL | Promise<URL>;

	abstract init(): Promise<void>;

	abstract updateData<U, V>(u: U, v: V): Promise<void>;

	abstract checkData(hn: HackerNews): boolean;

	async loadData(): Promise<HackerNews[]> {
		try {
			const hnlist = new HackerNewsList();
			const result = await hnlist.getList();
			if (result.length === 0) {
				throw new Error("No data");
			}
			return result;
		}
		catch (error) {
			throw new Error(`${error}`);
		}
	}

}
