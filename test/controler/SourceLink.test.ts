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
import { SourceLink } from "../../src/controler/service/SourceLink";

const sourcelink = new SourceLink();

test("test source link", async () => {
    try {
        await sourcelink.init();
    }
    catch (e) {
        throw new Error(e);
    }

    expect(1).toBe(1);
})