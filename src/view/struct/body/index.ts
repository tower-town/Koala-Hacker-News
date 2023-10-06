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
        const hnDict = this.sliceChapter(hnlist);
        const outlineDataZip = this.#getOutlinedata(hnDict);

        const outlineHead = this.#outline.loadHead();
        const outlineBody = _.chain(outlineDataZip)
            .map((v, _) => {
                this.#chapter.updateData(v.data);
                return this.#outline.loadBody(v.key, v.data[0].pathNode);
            })
            .reduce((acc, item) => acc + item, "")
            .value();
        const outlineTail = this.#outline.loadTail();

        const outlineData = `${outlineHead}${outlineBody}${outlineTail}`;
        const readme = `${this.#head}${outlineData}${this.#foot}`;

        await Utils.writeFile(this.#indexPath, readme);
        return;
    }

    sliceChapter(hnlist: HackerNewsBeamer[]): _.Dictionary<HackerNewsBeamer[]> {
        function fmtChapter(chapter: Date): string {
            // if you use much more date oparation, I recommend you use date-fnt or moment.js
            return `${format(chapter, "yyyyQQQ")}`;
        }

        return _.groupBy(hnlist, (item) => fmtChapter(item.fmtPubdate));
    }

    #getOutlinedata(hnDict: _.Dictionary<HackerNewsBeamer[]>) {
        return _.chain(hnDict)
            .map((v, k) => {
                const subDict = this.#chapter.sliceData(v);
                return {
                    key: k,
                    data: _.chain(subDict)
                        .map((subValue, subKey) => {
                            const cpath = path.join(this.#chapterPath, `${k}-Hacker-News.md`);
                            const pathNode = new PathNode(this.#indexPath, cpath);
                            pathNode.join(path.join(this.#chapterPath, `${k}/${subKey}-Hacker-News.md`));
                            pathNode.nextNode.end();
                            return {
                                HackerNews: subValue,
                                pathNode: pathNode,
                            }
                        })
                        .value()
                }
            })
            .value();
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
        return `- [${prefix}: [Hacker News 周报]](${pathNode.nextPath})\n`;
    }

}