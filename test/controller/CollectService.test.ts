/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : Collect.test.ts
*   Last Modified : 2023-08-26 13:07:45
*   Describe      : 
*
* ====================================================
*/


import { CollectService } from "@src/controller/service/CollectService";

const collect = new CollectService();

test("test Collect InitUrl", () => {
    const url: URL = collect.initUrl()
    expect(url).toBeInstanceOf(URL);
})

test("test Collect initData", async () => {
    await collect.init();
    expect(!collect.init()).toBeNull;
})