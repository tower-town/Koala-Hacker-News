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
    #preNode: PathNode = {} as PathNode;
    #nextNode: PathNode = {} as PathNode;
    #data: {
        prevPath: string;
        currentPath: string;
        nextPath: string;
    } = {
            prevPath: "",
            currentPath: "",
            nextPath: ""
        }

    constructor(prevPath: string, nextPath: string, currentPath = "") {
        this.#data.prevPath = prevPath;
        this.#data.currentPath = currentPath || prevPath;
        this.#data.nextPath = nextPath;
    }

    public get nextNode(): PathNode {
        return this.#nextNode;
    }
    public set nextNode(value: PathNode) {
        this.#nextNode = value;
    }

    public get preNode(): PathNode {
        return this.#preNode;
    }
    public set preNode(value: PathNode) {
        this.#preNode = value;
    }

    get prevPath(): string {
        return this.#transformPath(this.#data.currentPath, this.#data.prevPath);
    }

    get realPrevPath(): string {
        return this.#data.prevPath;
    }

    get nextPath(): string {
        return this.#transformPath(this.#data.currentPath, this.#data.nextPath);
    }

    get realNextPath(): string {
        return this.#data.nextPath;
    }

    get currentPath(): string {
        return this.#data.currentPath;
    }


    join(nextPath: string): PathNode {
        const newNode = new PathNode(this.#data.prevPath, nextPath, this.#data.nextPath);
        newNode.preNode = this;
        this.#nextNode = newNode;
        return this.#nextNode;
    }

    end(): PathNode {
        const newNode = new PathNode(this.#data.currentPath, this.#data.nextPath, this.#data.nextPath);
        newNode.preNode = this;
        this.#nextNode = newNode;
        return this.#nextNode;
    }

    #transformPath(from: string, to: string): string {
        const relativePath = path.relative(path.dirname(from), to);
        return relativePath.replace(/\\/g, "/");
    }
}