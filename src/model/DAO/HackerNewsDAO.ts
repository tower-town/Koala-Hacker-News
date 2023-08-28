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

import { HackerNews } from "../beamer/HackerNews";

export interface HackerNewsDAO {
	getList(): Promise<HackerNews[]>;
	getMap(): Promise<Map<string, HackerNews>>;

	updateList(hnlist: HackerNews[], hn: HackerNews): Promise<void>;
}
