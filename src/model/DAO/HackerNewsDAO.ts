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

import { HackerNews } from "../beam/HackerNews";

export interface HackerNewsDAO {
	tranformListToMap(hackernewsList: HackerNews[]): Record<string, HackerNews>;

	tranformMapToList(hackernewsMap: Record<string, HackerNews>): HackerNews[];

	get HackerNewsList(): HackerNews[];

	get HackerNewsMap(): Record<string, HackerNews>;

	updateHackerNews(hackernews: HackerNews): boolean;

	saveHackerNews(jsonPath: string, data: HackerNews[]): void;

	get Bvids(): string[] | undefined;
}
