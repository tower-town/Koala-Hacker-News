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
import { DetailsBeamer } from "@src/model/beamer/DetailsBeamer";
import { HackerNewsBeamer } from "@src/model/beamer/HackerNewsBeamer";
import { MarkdownView } from "@src/view/script/MarkdownView";

const markdown = new MarkdownView();
test("test getTab", async () => {
    const hn = new HackerNewsBeamer(
        "bvid",
        "title",
        1,
        1,
        [],
        [new DetailsBeamer("author", "time", "url")],
        ["ai-1.com", "ai-2.com", "ai-3.com"]
    )
    const tab = await markdown.generateTable(hn);
    expect(!tab).toBe(false);
})