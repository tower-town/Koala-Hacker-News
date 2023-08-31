/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : database.test.ts
*   Last Modified : 2023-08-30 21:33:54
*   Describe      : 
*
* ====================================================
*/

import * as fs from "fs";
import path from "path";
import { Utils } from "@src/common/utils";
import { HackerNewsList } from "@src/model/HackerNewsList";
import { HackerNewsBeamer } from "@src/model/beamer/HackerNewsBeamer";
import _ from "underscore";

test('database', () => {
    const databaseDir = path.join(__dirname, '../../src/data');
    expect(fs.existsSync(databaseDir)).toBe(true);
    fs.readdir(databaseDir, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        expect(files.length).toBeGreaterThan(0);
    })
})

test("group database", async () => {
    const databaseDir = path.join(__dirname, '../data/json');
    expect(fs.existsSync(databaseDir)).toBe(true);

    const hn = new HackerNewsList();
    hn.DatabaseDir = databaseDir;
    const hnlist = await hn.getList();
    hn.updateList(hnlist, {} as HackerNewsBeamer);
    const fileList = await Utils.readDir(databaseDir);
    expect(fileList.length).toBeGreaterThan(0);
})