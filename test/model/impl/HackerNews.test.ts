/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : HackerNews.ts
 *   Last Modified : 2023-08-10 13:15:36
 *   Describe      :
 *
 * ====================================================
 */

import { HackerNewsImpl } from "../../../src/model/impl/HackerNewsImpl";

test("test hackernewsImpl", () => {
	const HNS = new HackerNewsImpl();
	const hnlist = HNS.HackerNewsList;
	hnlist.map((v, _) => console.log(v.Source));

	// console.log(HNS.tranformListToMap(hnlist));
});
