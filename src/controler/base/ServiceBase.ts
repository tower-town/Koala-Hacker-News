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

import { HackerNews } from "../../componet/HackerNews";
import { Api } from "./ApiBase";

export abstract class ServiceBaseDAO {
	abstract InitUrl<T>(Tlist?: T[]): URL[];

	abstract CheckData<T>(Tlist: T[], t: T): boolean;

	public loadData<T>(t: T): HackerNews[] {
		const hns = [] as HackerNews[];
		return hns;
	}
}
