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

import fs from "fs";
import path from "path";
import { Utils } from "@src/common/utils";
import { HackerNewsBeamer } from "@src/model/beamer/HackerNewsBeamer";
import { format } from "date-fns";
import _ from "underscore";
import { MarkdownView } from "../../script/MarkdownView";
import { chapter_foot } from "../foot/chapter";
import { chapter_head } from "../head/chapter";

export class ChapterBody {
    #markdown = new MarkdownView();
    #chapterHead = chapter_head;
    #chapterFoot = chapter_foot;
    #chapterPath = this.#markdown.chapterPath;

    async groupChapter(hnlist: HackerNewsBeamer[]): Promise<_.Dictionary<HackerNewsBeamer[]>> {
        return _.groupBy(hnlist, (item) => this.#fmtChapter(item.fmtPubdate));
    }

    async updateChapter(hnlist: HackerNewsBeamer[]): Promise<void> {

        const hns = await this.groupChapter(hnlist);
        _.chain(hns)
            .map((v, quarter) => {
                this.#updateOutline(
                    `${this.#chapterPath}/${quarter}-Hacker-News.md`,
                    this.#loadQuarterOutline(v)
                )
                this.#updateQuarterTable(quarter, v);
                // console.warn(cpath, data);
            })
            .value();
    }

    #checkChapterPath(chapter: string): boolean {
        return true;
    }

    #loadQuarterOutline(hnlist: HackerNewsBeamer[]): string {
        return _.reduce(hnlist, (memo: string, v) => {
            const quarter = format(v.fmtPubdate, "yyyyQQQ");
            const yearmonth = format(v.fmtPubdate, "yyyy-MM");
            const datetime = format(v.fmtPubdate, "yyyy-MM-dd");
            const title = this.#loadChapterOutline(v.Title) ? this.#loadChapterOutline(v.Title) : v.Title;
            return `${memo}- ${datetime} [HackerNews周报](./${quarter}/${yearmonth}-Hacker-News.md)\n${title}`
        }, "")
    }

    #loadChapterOutline(title: string): string | undefined {
        return _.chain(title.split(/；/))
            .map(v => v.replaceAll(" ", ""))
            .map(v => v.replace("[HackerNews周报]", ""))
            .map(v => v.trim())
            .reduce((memo, v) => {
                return `${memo}  - ${v}\n`;
            }, "")
            .value();

    }

    async #updateOutline(path: string, data: string): Promise<void> {
        const outlineHead = "## [返回主目录](../README.md)\n\n";
        await Utils.writeFile(path, `${outlineHead}${data}`);
    }

    #updateQuarterTable(quarter: string, hnlist: HackerNewsBeamer[]): void {
        _.chain(hnlist)
            .groupBy(v => `${format(v.fmtPubdate, "yyyy-MM")}`)
            .map((v, k) => {
                const cpath = path.join(this.#chapterPath, `./${quarter}/${k}-Hacker-News.md`);
                fs.promises.mkdir(path.dirname(cpath), { recursive: true });

                const chapterHead = `${this.#chapterHead}## [返回章节目录](../${quarter}-Hacker-News.md)\n`;
                const chapterBody = _.reduce(v, (memo, v) => {
                    return memo + this.#markdown.generateTable(v);
                }, "");
                const chapterFoot = this.#chapterFoot;
                const data = `${chapterHead}${chapterBody}${chapterFoot}`;
                Utils.writeFile(cpath, `${data}`);
            })
            .value();
    }

    #fmtChapter(chapter: Date): string {
        // if you use much more date oparation, I recommend you use date-fnt or moment.js
        return `${format(chapter, "yyyyQQQ")}`;
    }
}