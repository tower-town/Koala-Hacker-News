/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : main.ts
*   Last Modified : 2023-08-28 20:14:37
*   Describe      : 
*
* ====================================================
*/

import { HackerNewsBeamer } from "@src/model/beamer/HackerNewsBeamer";
import { ViewStruct } from "./struct";

export class View {
    #struct = new ViewStruct();

    async display(hnlist: HackerNewsBeamer[]): Promise<void> {
        await this.#struct.updateData(hnlist);
    }
}