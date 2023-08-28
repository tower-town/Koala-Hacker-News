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

	abstract updateData<U, V>(u: U, v: V): void;

	abstract checkData(hn: HackerNews): boolean;

	async loadData(): Promise<HackerNews[]> {
		const hnlist = new HackerNewsList();
		return await hnlist.getList();
	}

}
