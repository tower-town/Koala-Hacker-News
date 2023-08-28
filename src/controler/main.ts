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

import { Collect } from "./service/Collect";
import { Comment } from "./service/Comment";
import { SourceLink } from "./service/SourceLink";

export class Startup {
    #comment = new Comment();
    #sourcelink = new SourceLink()
    #collect = new Collect()
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