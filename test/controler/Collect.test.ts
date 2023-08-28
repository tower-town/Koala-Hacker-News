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


import { Collect } from "../../src/controler/service/Collect";

const collect = new Collect();

test("test Collect InitUrl", () => {
    expect(collect.initUrl()).toBeNull;
})

test("test Collect initData", async () => {
    await collect.init();
    expect(collect.init()).toBeNull;
})