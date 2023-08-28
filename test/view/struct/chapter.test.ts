/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : chapter.ts
*   Last Modified : 2023-08-28 13:25:48
*   Describe      : 
*
* ====================================================
*/
import { ChapterBody } from "../../../src/view/struct/body/chapter";
import { HackerNewsList } from "../../../src/model/HackerNewsList";
import _ from "underscore";

const chapterBody = new ChapterBody()

test("test splitDict", async () => {
    const hnlist = await new HackerNewsList().getList();
    await chapterBody.splitDict(hnlist)
})

test("test updateChapter", async () => {
    const hnlist = await new HackerNewsList().getList();
    await chapterBody.updateChapter(hnlist);
})