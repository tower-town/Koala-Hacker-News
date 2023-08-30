/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : HackerNewsService.ts
 *   Last Modified : 2023-08-10 09:19:18
 *   Describe      :
 *
 * ====================================================
 */

import { HackerNewsBeamer } from "../beamer/HackerNewsBeamer";

export interface HackerNewsDAO {
	getList(): Promise<HackerNewsBeamer[]>;
	getMap(): Promise<Map<string, HackerNewsBeamer>>;

	updateList(hnlist: HackerNewsBeamer[], hn: HackerNewsBeamer): Promise<void>;
}
