/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : base.ts
*   Last Modified : 2023-08-27 23:13:44
*   Describe      : 
*
* ====================================================
*/

import path from "path";

export abstract class ViewBase {
    chapterPath: string = path.join(__dirname, "../../../Hacker-News");
    indexPath: string = path.join(__dirname, "../../../README.md");

    abstract sendMsg(): string;
};
