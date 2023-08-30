/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : SourceLink.ts
*   Last Modified : 2023-08-27 18:14:38
*   Describe      : 
*
* ====================================================
*/

import _ from "underscore";
import { Utils, fetchJson } from "@src/common/utils";
import { HackerNewsBeamer } from "@src/model/beamer/HackerNewsBeamer";
import { ServiceBaseDAO } from "../base/ServiceBase";
import { HackerNewsList } from "@src/model/HackerNewsList";

export class SourceLinkService extends ServiceBaseDAO {

    async init(): Promise<void> {
        const hnlist = await this.loadData();
        const result = _.chain(hnlist)
            .filter(this.filterData)
            .map(hn => fetchJson(this.initUrl(hn.Bvid)))
            .map(promise => promise.then(value => {
                this.updateData(hnlist, {
                    bvid: value.data.bvid,
                    link: Utils.captureLink(value.data.desc)
                })
            }))
            .value();
    }

    initUrl(bvid: string): URL {
        const infoApi = this.data.videoInfoURLParams;
        const url = new URL(infoApi.url);
        const params = new URLSearchParams(infoApi.params);
        params.set("bvid", String(bvid));
        return Utils.parseUrl(url, params);
    }

    async updateData<U, V>(u: U, v: V): Promise<void> {
        const hnlist = await u as HackerNewsBeamer[];
        const data = await v as {
            bvid: string,
            link: string[]
        }
        _.chain(hnlist)
            .filter(hn => hn.Bvid === data.bvid)
            .map((hn, _) => {
                hn.Source = data.link;
                new HackerNewsList().updateList(hnlist, hn);
            })
            .value();
    }

    filterData(hn: HackerNewsBeamer): boolean {
        if (hn.Source) {
            return false
        }
        return true;
    }
}
