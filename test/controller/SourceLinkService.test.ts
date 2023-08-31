/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : SourceLink.test.ts
*   Last Modified : 2023-08-27 18:58:33
*   Describe      : 
*
* ====================================================
*/
import { SourceLinkService } from "@src/controller/service/SourceLinkService";

const sourcelink = new SourceLinkService();

test("test sourceLinkService initUrl", () => {
    const url: URL = sourcelink.initUrl("BV1Tz4y1u7VR")
    expect(url).toBeInstanceOf(URL);
})

test("test sourcelink", async () => {
    try {
        await sourcelink.init();
    }
    catch (e) {
        throw new Error(`${e}`);
    }
    const hnList = await sourcelink.loadData();
    expect(hnList.length).toBeGreaterThan(0);
})