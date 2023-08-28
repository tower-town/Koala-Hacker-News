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

import { HackerNews } from "../model/beamer/HackerNews";
import { ViewStruct } from "./struct";

export class View {
    #struct = new ViewStruct();

    async display(hnlist: HackerNews[]): Promise<void> {
        await this.#struct.updateData(hnlist);
    }
}