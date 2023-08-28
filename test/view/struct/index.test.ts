/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : index.test.ts
*   Last Modified : 2023-08-28 12:03:39
*   Describe      : 
*
* ====================================================
*/

import { HackerNewsList } from "../../../src/model/HackerNewsList";
import { ViewStruct } from "../../../src/view/struct/index";

const struct = new ViewStruct();

test("test StructBody", async () => {
    const main = struct;
    const hnlist = await new HackerNewsList().getList()
    await main.updateData(hnlist)
})