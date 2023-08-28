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

import _ from "underscore";
import format from "html-format";
import { Details } from "../../model/beamer/Details";
import { HackerNews } from "../../model/beamer/HackerNews";
import { ViewBase } from "./base";


export class Markdown extends ViewBase {
    sendMsg(): string {
        throw new Error("Method not implemented.");
    }


    getTab(hn: HackerNews): string {
        const table = new Tables();
        return table.init(hn);
    }

    async loadDocsDict(hn: HackerNews[]): Promise<_.Dictionary<HackerNews[]>> {
        const docs = new Docs()
        return await docs.loadDict(hn);
    }

}

class Tables {

    #getTrDetailsItem(details: Details): string {
        return `
            <tr>
                <td>${details.Name}</td>
                <td>${details.Intro}</td>
                <td>${details.Link}</td>
            </tr>`.trim();
    }

    #getTrAIItem(ai: string): string {
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

    #getTitle(title: string, bvid: string): string {
        return `[${title}](https://www.bilibili.com/video/${bvid})`
    }


    init(hn: HackerNews): string {
        return format(
            this.#getTitle(hn.Title, hn.Bvid).concat(
                this.#wrapTable(
                    this.#getHead()
                        .concat(this.#wrapBody(
                            _.reduce(hn.Data as Details[], (acc, item) => acc.concat(this.#getTrDetailsItem(item)), "")
                                .concat(`<tr>
                                <td>一周 AI 小结</td>
                                <td></td>
                                <td></td>
                            </tr>`)
                                .concat(_.reduce(hn.Ai as string[], (acc, item) => acc.concat(this.#getTrAIItem(item)), ""))
                        )))));

    }
}

class Docs {
    #groupbyPubdate(hn: HackerNews[]) {
        return _.groupBy(hn, v => this.#fmtPubdate(v.Pubdate))
    }

    #fmtPubdate(pubdate: number): string {
        const date = new Date(pubdate * 1000);
        return `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    async loadDict(hn: HackerNews[]): Promise<_.Dictionary<HackerNews[]>> {
        return this.#groupbyPubdate(hn);
    }
}
