/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : string.test.ts
*   Last Modified : 2023-09-04 06:57:44
*   Describe      : 
*
* ====================================================
*/


test('test 10000 element string concat vs 10000 element string list join effect', () => {
    const TIMES = 1000_000;
    const t0 = performance.now();
    let str = ""
    for (let i = 0; i < TIMES; i++) {
        const element = `<td>test${i}</dt>\n`;
        str += element;
    }
    const t1 = performance.now();
    console.warn(`concat ${TIMES} element string cost ${t1 - t0} ms`);


    const t2 = performance.now();
    const strList: string[] = [];
    for (let i = 0; i < TIMES; i++) {
        const element = `<td>test${i}</dt>\n`;
        strList.push(element);
    }
    const strListJoin = strList.join("");
    const t3 = performance.now();
    console.warn(`list join ${TIMES} element string cost ${t3 - t2} ms`);


    if (t3 - t2 < t1 - t0) {
        console.warn("list join is faster than concat");
        expect(t3 - t2).toBeLessThan(t1 - t0);
    } else {
        console.warn("concat is faster than list join");
        expect(t3 - t2).toBeGreaterThan(t1 - t0);
    }

})