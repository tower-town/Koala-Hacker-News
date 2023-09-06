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
import { OutlineView, PathNode } from "@src/view/script/OutlineView";
import { format } from "date-fns";
import _ from "underscore";
import { MarkdownView } from "../../script/MarkdownView";
import { footChapter } from "../foot/chapter";
import { headChapter } from "../head/chapter";

export class ChapterBody {
    #markdown = new MarkdownView();
    #chapterHead = headChapter;
    #chapterFoot = footChapter;
    #chapterPath = this.#markdown.chapterPath;
    #outline = new Outline();

    async sliceData(hnlist: HackerNewsBeamer[]): Promise<_.Dictionary<HackerNewsBeamer[]>> {
        function fmtChapter(chapter: Date): string {
            return `${format(chapter, "yyyy-MM")}`;
        }
        return _.groupBy(hnlist, (item) => fmtChapter(item.fmtPubdate));
    }

    async updateData(pathNode: PathNode, hnlist: HackerNewsBeamer[], groupKey: string): Promise<void> {
        const groupData = await this.sliceData(hnlist);
        const outlineHead = this.#outline.loadHead(pathNode.relPrevPath);
        const outlineTail = this.#outline.loadTail();
        const outlineBody = _.chain(groupData)
            .map((v, k) => {
                const subPathNode = pathNode.join(path.join(this.#chapterPath, `${groupKey}/${k}-Hacker-News.md`));
                this.updateSubPathTable(subPathNode.end(), v);
                return _.reduce(v, (memo, val) => memo + this.#outline.loadBody(val, subPathNode), "");
            })
            .reduce((acc, item) => acc + item, "")
            .value();
        const data = `${outlineHead}${outlineBody}${outlineTail}`;
        await Utils.writeFile(pathNode.currentPath, `${data}`);
        // console.warn(cpath, data);
    }

    async updateSubPathTable(pathNode: PathNode, hnlist: HackerNewsBeamer[]): Promise<void> {
        const cpath = pathNode.absNextPath;
        await fs.promises.mkdir(path.dirname(cpath), { recursive: true });
        const chapterHead = `${this.#chapterHead}## [返回章节目录](${pathNode.relPrevPath})\n`;
        const chapterBody = _.chain(hnlist)
            .reduce((memo, v) => {
                return memo + this.#markdown.generateTable(v);
            }, "")
            .value();
        const chapterFoot = this.#chapterFoot;
        const data = `${chapterHead}${chapterBody}${chapterFoot}`;
        await Utils.writeFile(cpath, `${data}`);
    }

}

class Outline extends OutlineView {
    async update(pathNode: PathNode, hnList: HackerNewsBeamer[]): Promise<string> {
        const head = this.loadHead(pathNode.relPrevPath);
        const body = _.reduce(hnList, (memo: string, v) => memo + this.loadBody(v, pathNode), "");
        const tail = this.loadTail();
        const data = `${head}${body}${tail}`;
        return data;
    }

    loadHead(str: string): string {
        return `## [返回主目录](${str})\n\n`;
    }

    loadBody(data: HackerNewsBeamer, pathNode: PathNode): string {
        return `${this.#loadTitle(pathNode, data.fmtPubdate, data.Title)}`;
    }

    loadTail(): string {
        return "";
    }

    #loadTitle(pathNode: PathNode, pubdate: Date, title: string): string {
        return `${this.#wrapTitleHead(pathNode, pubdate)}${this.#loadTitleItem(title) || title}`;
    }

    #loadTitleItem(title: string): string | undefined {
        return _.chain(title.split(/\]|；/))?.slice(1)
            .compact()
            .map(v => v.replaceAll(" ", ""))
            .map(v => v.trim())
            .reduce((memo, v) => {
                return `${memo}  - ${v}\n`;
            }, "")
            .value();
    }

    #wrapTitleHead(pathNode: PathNode, pubdate: Date): string {
        const datetime = format(pubdate, "yyyy-MM-dd");
        return `- ${datetime} [HackerNews周报](${pathNode.relNextPath})\n`;
    }
}
