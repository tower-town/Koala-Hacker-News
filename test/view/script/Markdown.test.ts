/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : Markdown.ts
*   Last Modified : 2023-08-28 10:20:27
*   Describe      : 
*
* ====================================================
*/
import { Details } from "../../../src/model/beamer/Details";
import { HackerNews } from "../../../src/model/beamer/HackerNews";
import { Markdown } from "../../../src/view/script/Markdown";

const markdown = new Markdown();
test("test getTab", async () => {
    const hn = new HackerNews(
        "bvid",
        "title",
        1,
        1,
        [],
        [new Details("author", "time", "url")],
        ["ai-1.com", "ai-2.com", "ai-3.com"]
    )
    const tab = await markdown.getTab(hn);
    // expect(tab).toBe("");
})