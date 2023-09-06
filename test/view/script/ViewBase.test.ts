/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : ViewBase.test.ts
*   Last Modified : 2023-09-04 07:00:09
*   Describe      : 
*
* ====================================================
*/

import { PathNode } from "@src/view/script/OutlineView";


test("test PathNode join", () => {
    const prevpath = "/test/README.md";
    const nextpath = "/test/ch/ch01.md";
    const pathnode = new PathNode(prevpath, nextpath);

    expect(pathnode.currentPath).toBe(prevpath);
    expect(pathnode.nextPath).toBe('ch/ch01.md');

    const subpath = '/test/ch/ch01/1.md';
    const subpathnode = pathnode.join(subpath);
    expect(subpathnode.prevPath).toBe('../README.md');
    expect(subpathnode.nextPath).toBe('ch01/1.md');

    const endPathNode = subpathnode.end();
    expect(endPathNode.currentPath).toBe(subpath);
    expect(endPathNode.prevPath).toBe('../ch01.md');
})
