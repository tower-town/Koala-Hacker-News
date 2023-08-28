/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : chapter.ts
*   Last Modified : 2023-08-27 20:19:48
*   Describe      : 
*
* ====================================================
*/

import _ from "underscore";
import { HackerNews } from "../../../model/beamer/HackerNews";
import { Markdown } from "../../script/Markdown";
import path from "path";
import { Utils } from "../../../common/utils";

export class ChapterBody {
    #markdown = new Markdown();
    #chapterPath = this.#markdown.chapterPath;

    async splitDict(hnlist: HackerNews[]): Promise<_.Dictionary<HackerNews[]>> {
        return _.groupBy(hnlist, (item) => this.#fmtChapter(item.fmtPubdate));
    }

    async updateChapter(hnlist: HackerNews[]): Promise<void> {

        const hns = await this.splitDict(hnlist);
        _.chain(hns)
            .map((v, k) => async () => {
                const cpath = path.join(this.#chapterPath, k);
                const data = _.chain(v)
                    .reduce((memo, v) => {
                        return memo + "\n" + this.#markdown.getTab(v);
                    }, "")
                    .value();
                // console.warn(cpath, data);
                await Utils.writeFile(cpath, data);
            })
            .value();
    }

    #checkChapterPath(chapter: string): boolean {
        return true;
    }

    /*
    fill 0 if the month little 10
    */
    #fmtChapter(chapter: Date): string {
        return `${chapter.getFullYear()}-${chapter.getMonth() + 1 < 10 ? `0${chapter.getMonth() + 1}` : chapter.getMonth() + 1}-Hacker-News.md`;
    }
}