/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : Comment.ts
*   Last Modified : 2023-08-26 13:49:23
*   Describe      : 
*
* ====================================================
*/

import _ from "underscore";
import { Utils, fetchJson } from "../../common/utils";
import { HackerNewsBeamer } from "../../model/beamer/HackerNewsBeamer";
import { ServiceBaseDAO } from "../base/ServiceBase";
import { HackerNewsList } from "../../model/HackerNewsList";
import { DetailsList } from "../../model/DetailsList";
import { DetailsJson } from "../../common/type";

export class CommentService extends ServiceBaseDAO {
    #mid = new URLSearchParams(this.data.commentURLParams.params).get("mid");

    initUrl(aid: number): URL {
        const apiData = this.data.commentURLParams;
        const url = new URL(apiData.url);
        const apiParams = new URLSearchParams(apiData.params);

        apiParams.set("oid", String(aid));
        return Utils.parseUrl(url, apiParams);
    }

    filterData(hn: HackerNewsBeamer): boolean {
        if (hn.Details) {
            return false;
        }
        return true;
    }


    async updateData<U, V>(u: U, v: V): Promise<void> {
        try {
            const data = await v as {
                data: DetailsJson[]
                ai: string[]
                oid: number
            }
            const hnlist = await u as HackerNewsBeamer[];
            let hn = {} as HackerNewsBeamer;
            _.chain(hnlist)
                .filter(v => v.Aid === data.oid)
                .map((v, _) => {
                    hn = v;
                    hn.Details = hn.Details ? hn.Details : new DetailsList().getList(data.data);
                    hn.Ai = hn.Ai ? hn.Ai : data.ai;
                    new HackerNewsList().updateList(hnlist, hn);
                })
                .value()
        }
        catch (e) {
            throw new Error(`Error in Collect UpdateData: ${e}`);
        }
    }

    async init(): Promise<void> {
        const hnlist = await this.loadData();
        const result = _.chain(hnlist)
            .filter(v => this.filterData(v))
            .map((value) => this.initUrl(value.Aid))
            .map((url) => fetchJson(url))
            .map((promise) =>
                promise.then((value) =>
                    this.#parseComment(
                        this.#getTopComment(value.data, this.#mid as string)
                    )
                ))
            .map((promise) =>
                promise.then((value) => {
                    const { name, intro } = this.#flatmapIntro(value.data.intro)
                    this.updateData(hnlist, {
                        oid: value.oid,
                        data: this.#zipIntroData(name, intro, value.data.link),
                        ai: this.#flatmapAi(value.data.ai)
                    })
                }
                ))
            // .map((promise) =>
            //     promise.then((value) => {
            //         console.log(value);
            //         return value;
            //     })
            // )
            .value();
    }


    #getTopComment(
        // rome-ignore lint/suspicious/noExplicitAny: <explanation>
        comment: Record<string, any>,
        mid: string
    ): {
        oid: number;
        list: string[];
    } {
        const top = {
            comment: comment.top.upper,
            reply: comment.replies[0],
        };

        const message = {
            content: "",
            comment: "",
            reply: "",
            dict: {
                oid: top.reply.oid,
                list: [] as string[],
            },
        };

        message.dict.list = [];

        if (top.comment === null) {
            message.comment = "";
            if (top.reply.member.mid === mid) {
                message.reply = top.reply.content.message;
            }
        } else {
            message.comment = top.comment.content.message;
            if (top.comment.replies !== null) {
                message.reply = top.comment.replies[0].content.message;
            }
        }

        message.content = `${message.comment}\n${message.reply}`;

        message.content.split("\n").forEach((value, _) => {
            value.trim() && message.dict.list.push(value.trim());
        });

        return message.dict;
    }

    #parseComment(message: {
        oid: number;
        list: string[];
    }): {
        oid: number,
        data: {
            intro: string[];
            link: string[];
            ai: string[];
        }
    } {
        const message_data = message.list;
        const intro = {
            intro: [] as string[],
            link: [] as string[],
            ai: [] as string[],
        }

        let ms_status = "";
        for (const value of message_data) {
            const pre_ms_status = value.match(/^[\u4e00-\u9fa5].*：?$/)?.[0] || "";
            ms_status = pre_ms_status ? pre_ms_status.replace(/(本周)|(一周)|(本期)/, "").replace(/：.*/, "").trim() : ms_status;
            if (!pre_ms_status) {
                switch (ms_status) {
                    case "时间轴":
                        /^[0-9hw].*/.test(value) && !value.includes('AI 小结') && intro.intro.push(value);
                        break;
                    case "项目链接":
                        /^https?:\/\/\S+/.test(value) && intro.link.push(value);
                        break;
                    case "AI 小结":
                        /^https?:\/\/\S+/.test(value) && intro.ai.push(value);
                        break;
                    default:
                        console.warn(`oid: ${message.oid} missing catch ${value}`);
                        console.warn(`oid: ${message.oid} the message data is \n${message_data}`);
                        break;
                }
            }
        }

        return {
            oid: message.oid,
            data: intro
        };
    }

    #zipIntroData(name: string[], intro: string[], link: string[]): {
        name: string;
        intro: string;
        link: string;
    }[] {
        return _.zip(name, intro, link)
            .map((value) => {
                return {
                    name: value[0],
                    intro: value[1],
                    link: value[2],
                }
            })
    }
    #flatmapAi(ai: string[]): string[] {
        return ai
            .map((value) => Utils.captureLink(value))
            .flatMap((value) => value)
    }

    #flatmapIntro(intro: string[]) {
        const nameList = [] as string[];
        const introList = [] as string[];
        intro
            .filter((value, _) => /^[0-9hw].*/.test(value))
            .map((value, _) => {
                const { name, intro } = this.#captureNameIntro(value, this.#mid as string);
                nameList.push(name);
                introList.push(intro);
            })
        return {
            name: nameList,
            intro: introList,
        }

    }

    #captureNameIntro(
        intro_str: string,
        bvid: string,
    ): {
        name: string;
        intro: string
    } {
        const regexp = /\d{2}(?::|：)(?:\s+)?\d{2}(?:\s+)?([^｜|，,]+)?([｜\|，,])?(.+$)/g;
        const value = intro_str;
        const capture = {
            name: "",
            intro: "",
        };

        const captures = [...value.matchAll(regexp)][0];
        if (captures) {
            if (captures[2]) {
                capture.name = captures[1] || "";
                capture.intro = captures[3];
            } else {
                capture.name = "";
                capture.intro = captures[1] + captures[3];
            }
        } else {
            console.warn(`warning: escaple capture is ${value} in bvid: ${bvid}`);
        }
        return {
            name: capture.name.trim(),
            intro: capture.intro.trim(),
        };
    }
}