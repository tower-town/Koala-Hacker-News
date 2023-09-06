/*
* ====================================================
*   Copyright (C) 2023 river All rights reserved.
*
*   Author        : tower_town
*   Email         : tower_town@outlook.com
*   File Name     : OutlineView.ts
*   Last Modified : 2023-09-01 10:12:26
*   Describe      : 
*
* ====================================================
*/

import path from "path";
import { HackerNewsBeamer } from "@src/model/beamer/HackerNewsBeamer";

export abstract class OutlineView {
    abstract loadHead(str: string): string;

    abstract loadBody(data: HackerNewsBeamer | string, pathNode: PathNode): string;

    abstract loadTail(str: string): string;
}

export class PathNode {
    #prevPath: string;
    #currentPath: string;
    #nextPath: string;
    constructor(prevPath: string, nextPath: string, currentPath = "") {
        this.#prevPath = prevPath;
        this.#currentPath = currentPath || prevPath;
        this.#nextPath = nextPath;
    }

    get relPrevPath(): string {
        return this.#transformPath(this.#currentPath, this.#prevPath);
    }

    get absPrevPath(): string {
        return this.#prevPath;
    }

    get relNextPath(): string {
        return this.#transformPath(this.#currentPath, this.#nextPath);
    }

    get absNextPath(): string {
        return this.#nextPath;
    }

    get currentPath(): string {
        return this.#currentPath;
    }


    join(nextPath: string): PathNode {
        return new PathNode(this.#prevPath, nextPath, this.#nextPath);
    }

    end(): PathNode {
        return new PathNode(this.#currentPath, this.#nextPath, this.#nextPath);
    }

    #transformPath(from: string, to: string): string {
        const relativePath = path.relative(path.dirname(from), to);
        return relativePath.replace(/\\/g, "/");
    }
}