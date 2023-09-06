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

import path from "path";
import { Utils } from "@src/common/utils";
import { HackerNewsBeamer } from "@src/model/beamer/HackerNewsBeamer";
import { MarkdownView } from "@src/view/script/MarkdownView";
import { OutlineView, PathNode } from "@src/view/script/OutlineView";
import { format } from "date-fns";
import _ from "underscore";
import { footIndex } from "../foot/index";
import { headIndex } from "../head/index";
import { ChapterBody } from "./chapter";

export class BodyStruct {
    #markdown = new MarkdownView();
    #chapter = new ChapterBody();
    #outline = new Outline();
    #indexPath = this.#markdown.indexPath;
    #chapterPath = this.#markdown.chapterPath;
    #head = headIndex;
    #foot = footIndex;

    async update(hnlist: HackerNewsBeamer[]): Promise<void> {
        const hnDict = await this.sliceChapter(hnlist);

        const outlineHead = this.#outline.loadHead();
        const outlineBody = await _.chain(hnDict)
            .map((v, k) => (async () => {
                const cpath = path.join(this.#chapterPath, `${k}-Hacker-News.md`);
                const pathNode = new PathNode(this.#indexPath, cpath);
                await this.#chapter.updateData(pathNode, v, k);
                return this.#outline.loadBody(k, pathNode);
            })())
            .reduce((acc, item) => acc.then(async (v) => v + await item), Promise.resolve(""))
            .value();
        const outlineTail = this.#outline.loadTail();

        const outlineData = `${outlineHead}${outlineBody}${outlineTail}`;
        const readme = `${this.#head}${outlineData}${this.#foot}`;

        await Utils.writeFile(this.#indexPath, readme);
        return;
    }

    async sliceChapter(hnlist: HackerNewsBeamer[]): Promise<_.Dictionary<HackerNewsBeamer[]>> {
        function fmtChapter(chapter: Date): string {
            // if you use much more date oparation, I recommend you use date-fnt or moment.js
            return `${format(chapter, "yyyyQQQ")}`;
        }

        return _.groupBy(hnlist, (item) => fmtChapter(item.fmtPubdate));
    }

}

class Outline extends OutlineView {
    loadHead(): string {
        return "## 目录\n\n"
    }

    loadBody(hnList: string, pathNode: PathNode): string {
        return this.#loadTitle(pathNode, hnList);
    }

    loadTail(): string {
        return "";
    }

    #loadTitle(pathNode: PathNode, prefix: string): string {
        return `- [${prefix}: [Hacker News 周报]](${pathNode.relNextPath})\n`;
    }

}