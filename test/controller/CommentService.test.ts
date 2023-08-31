/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : Comment.test.ts
*   Last Modified : 2023-08-26 16:08:29
*   Describe      : 
*
* ====================================================
*/

import exp from "constants";
import { CommentService } from "@src/controller/service/CommentService";

const comment = new CommentService();

test("test CommentService initUrl", async () => {
    const url: URL = comment.initUrl(574943888);
    expect(url).toBeInstanceOf(URL);
})

test("test CommentService initData", async () => {
    await comment.init();
    const hnList = await comment.loadData()
    expect(hnList.length).toBeGreaterThan(0);
})