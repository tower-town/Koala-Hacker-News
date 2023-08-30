/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : index.ts
*   Last Modified : 2023-08-28 11:59:55
*   Describe      : 
*
* ====================================================
*/

import { HackerNewsBeamer } from "@src/model/beamer/HackerNewsBeamer";
import { ChapterBody } from "./body/chapter";
import { BodyStruct } from "./body/index";

export class ViewStruct {
    #index = new BodyStruct();
    #chapter = new ChapterBody()

    async updateData(hnlist: HackerNewsBeamer[]): Promise<void> {
        await this.#index.loadChapterList(hnlist);
        await this.#chapter.updateChapter(hnlist);
    }
}