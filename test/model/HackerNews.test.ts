/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : HackerNews.test.ts
 *   Last Modified : 2023-08-25 19:14:11
 *   Describe      :
 *
 * ====================================================
 */

import path from "path";
import { HackerNewsList } from "../../src/model/HackerNewsList";
import _ from "underscore";

test("test HackerNewsList getList", async () => {
	const hn = new HackerNewsList();
	hn.Pathjson = path.join(__dirname, "../data/data.json");
	const hnlist = await hn.getList();
	expect(hnlist.length).toBeGreaterThan(0);
	expect(hnlist[0].Data?.length).toBeGreaterThan(0);
});

test("test HackerNewsList getMap", async () => {
	const hn = new HackerNewsList();
	hn.Pathjson = path.join(__dirname, "../data/data.json");
	const hnlist = await hn.getList();

	console.log("chain_begin");

	_.chain(hnlist)
		.head(2)
		.map(key => console.log(key))
		.value();

	expect(hnlist.length).toBeGreaterThan(0);
})
