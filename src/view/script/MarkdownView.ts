/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : Markdown.ts
*   Last Modified : 2023-08-27 20:20:43
*   Describe      : 
*
* ====================================================
*/

import { DetailsBeamer } from "@src/model/beamer/DetailsBeamer";
import { HackerNewsBeamer } from "@src/model/beamer/HackerNewsBeamer";
import format from "html-format";
import _ from "underscore";
import { ViewBase } from "./base";


export class MarkdownView extends ViewBase {
    sendMsg(): string {
        throw new Error("Method not implemented.");
    }


    generateTable(hn: HackerNewsBeamer): string {
        const table = new Tables();
        return table.init(hn);
    }

    async loadDocsDict(hn: HackerNewsBeamer[]): Promise<_.Dictionary<HackerNewsBeamer[]>> {
        const docs = new Docs()
        return await docs.loadDict(hn);
    }

}

class Tables {

    #loadTrDetailsItem(details: DetailsBeamer): string {
        return `
            <tr>
                <td>${details.Name}</td>
                <td>${details.Intro}</td>
                <td>${details.Link}</td>
            </tr>`.trim();
    }

    #loadTrAIItem(ai: string): string {
        return `
            <tr>
                <td></td>
                <td></td>
                <td>${ai}</td>
            </tr>`.trim();
    }

    #getHead(): string {
        return `
            <theader>
                <th>名称</th>
                <th>简介</th>
                <th>链接</th>
            </theader>`.trim();
    }

    #wrapBody(tr_items: string): string {
        return `
            <tbody>
                ${tr_items}
            </tbody>`.trim();
    }

    #wrapTable(tables: string): string {
        return `
            <table>
                ${tables}
            </table>`.trim();
    }

    #loadTitle(title: string, bvid: string): string {
        return `\n\n[${title}](https://www.bilibili.com/video/${bvid})\n\n`
    }


    init(hn: HackerNewsBeamer): string {
        return format(
            this.#loadTitle(hn.Title, hn.Bvid).concat(
                this.#wrapTable(
                    this.#getHead()
                        .concat(this.#wrapBody(
                            _.reduce(hn.Details as DetailsBeamer[], (acc, item) => acc.concat(this.#loadTrDetailsItem(item)), "")
                                .concat(`<tr>
                                <td>一周 AI 小结</td>
                                <td></td>
                                <td></td>
                            </tr>`)
                                .concat(_.reduce(hn.Ai as string[], (acc, item) => acc.concat(this.#loadTrAIItem(item)), ""))
                        )))));

    }
}

class Docs {
    #groupbyPubdate(hn: HackerNewsBeamer[]) {
        return _.groupBy(hn, v => this.#fmtPubdate(v.Pubdate))
    }

    #fmtPubdate(pubdate: number): string {
        const date = new Date(pubdate * 1000);
        return `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    async loadDict(hn: HackerNewsBeamer[]): Promise<_.Dictionary<HackerNewsBeamer[]>> {
        return this.#groupbyPubdate(hn);
    }
}
