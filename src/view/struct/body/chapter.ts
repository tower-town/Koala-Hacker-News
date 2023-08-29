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
import fs from "fs";
import { HackerNews } from "../../../model/beamer/HackerNews";
import { Markdown } from "../../script/Markdown";
import path from "path";
import { Utils } from "../../../common/utils";
import { format } from "date-fns";
import { da } from "date-fns/locale";

export class ChapterBody {
    #markdown = new Markdown();
    #chapterPath = this.#markdown.chapterPath;

    async splitDict(hnlist: HackerNews[]): Promise<_.Dictionary<HackerNews[]>> {
        return _.groupBy(hnlist, (item) => this.#fmtChapter(item.fmtPubdate));
    }

    async updateChapter(hnlist: HackerNews[]): Promise<void> {

        const hns = await this.splitDict(hnlist);
        _.chain(hns)
            .map((v, quarter) => {
                this.#updateOutline(
                    `${this.#chapterPath}/${quarter}-Hacker-News.md`,
                    this.#getOutline(v)
                )
                this.#updateQM(quarter, v);
                // console.warn(cpath, data);
            })
            .value();
    }

    #checkChapterPath(chapter: string): boolean {
        return true;
    }

    #getOutline(hnlist: HackerNews[]): string {
        return _.reduce(hnlist, (memo: string, v) => {
            const quarter = format(v.fmtPubdate, "yyyyQQQ");
            const yearmonth = format(v.fmtPubdate, "yyyy-MM");
            const datetime = format(v.fmtPubdate, "yyyy-MM-dd");
            return `${memo}- ${datetime} [${v.Title}](./${quarter}/${yearmonth}-Hacker-News.md) \n`
        }, "")
    }

    async #updateOutline(path: string, data: string): Promise<void> {
        const outlineHead = "## 目录\n\n";
        await Utils.writeFile(path, `${outlineHead}${data}`);
    }

    #updateQM(quarter: string, hnlist: HackerNews[]): void {
        _.chain(hnlist)
            .groupBy(v => `${format(v.fmtPubdate, "yyyy-MM")}`)
            .map((v, k) => {
                const cpath = path.join(this.#chapterPath, `./${quarter}/${k}-Hacker-News.md`);
                fs.promises.mkdir(path.dirname(cpath), { recursive: true });
                const data = _.reduce(v, (memo, v) => {
                    return memo + this.#markdown.getTab(v);
                }, "");
                Utils.writeFile(cpath, data);
            })
            .value();
    }

    #fmtChapter(chapter: Date): string {
        // if you use much more date oparation, I recommend you use date-fnt or moment.js
        return `${format(chapter, "yyyyQQQ")}`;
    }
}