/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : utils.test.ts
*   Last Modified : 2023-08-27 15:54:14
*   Describe      : 
*
* ====================================================
*/

import { Utils } from "../../src/common/utils";

const utils = Utils
test("test captureLink", () => {
    const str = "https://about.fb.com https://blog.google/  https://www.p.x https://exmaple.com";
    const result = utils.captureLink(str)

    console.log(result);

})