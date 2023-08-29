/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : index.ts
*   Last Modified : 2023-08-27 20:19:29
*   Describe      : 
*
* ====================================================
*/

import { Markdown } from "../../script/Markdown";
import { head_index } from "../head/index";
import { foot_index } from "../foot/index";
import { ChapterBody } from "./chapter";
import { HackerNews } from "../../../model/beamer/HackerNews";
import _ from "underscore";
import path from "path";
import { Utils } from "../../../common/utils";

export class BodyStruct {
    #markdown = new Markdown();
    #indexPath = this.#markdown.indexPath;
    #chapterPath = this.#markdown.chapterPath;
    #chapter = new ChapterBody();
    #head = head_index;
    #foot = foot_index;

    async loadChapterList(hnlist: HackerNews[]): Promise<void> {
        const hnDict = await this.#chapter.splitDict(hnlist);
        const chapterList = _.chain(hnDict).keys()
            .map((key) =>
                this.#getOutline(
                    this.#transformPath(`${key}-Hacker-News.md`),
                    key,
                ))
            .reduce((acc, item) => acc + item, "")
            .value();

        const readme = this.#head + chapterList + this.#foot;

        // console.warn(readme);

        await Utils.writeFile(path.join(this.#indexPath), readme);
    }

    #getOutline(path: string, chapter: string): string {
        return `- [${chapter}: [Hacker News 周报]](${path})\n`;
    }

    /*
    modify the path.join just use Unix-like path style
    */
    #transformPath(key: string): string {
        const chapterPath = path.relative(path.dirname(this.#indexPath), path.join(this.#chapterPath, key));
        return chapterPath.replace(/\\/g, "/");
    }

}