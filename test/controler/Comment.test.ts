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

import { Comment } from "../../src/controler/service/Comment";

const comment = new Comment();
test("test Comment initData", async () => {
    await comment.init();
    expect(1).toBe(1);
})