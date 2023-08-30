/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : main.ts
*   Last Modified : 2023-08-28 20:04:53
*   Describe      : 
*
* ====================================================
*/

import { CollectService } from "./service/CollectService";
import { CommentService } from "./service/CommentService";
import { SourceLinkService } from "./service/SourceLinkService";

export class Service {
    #comment = new CommentService();
    #sourcelink = new SourceLinkService()
    #collect = new CollectService()
    hnlist = this.#collect.loadData

    async init() {
        try {
            await this.#collect.init();
            await this.#comment.init();
            await this.#sourcelink.init();
        }
        catch (err) {
            throw Error(`${err}`);
        }
    }
}