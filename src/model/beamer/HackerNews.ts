/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : HackerNew.ts
 *   Last Modified : 2023-08-09 21:22
 *   Describe      :
 *
 * ====================================================
 */

import { Details } from "./Details";

export class HackerNews {
	#bvid: string;
	#aid: number;
	#title: string;
	#pubdate: number;
	#source?: string[];
	#data?: Details[];
	#ai?: string[];

	constructor(
		bvid: string,
		title: string,
		aid: number,
		pubdate: number,
		source?: string[],
		data?: Details[],
		ai?: string[],
	) {
		this.#bvid = bvid;
		this.#aid = aid;
		this.#title = title;
		this.#pubdate = pubdate;
		this.#source = source;
		this.#data = data;
		this.#ai = ai;
	}

	get Bvid(): string {
		return this.#bvid;
	}

	get Aid(): number {
		return this.#aid;
	}

	get Pubdate(): number {
		return this.#pubdate;
	}

	get fmtPubdate(): Date {
		return new Date(this.#pubdate * 1000);
	}


	get Title(): string {
		return this.#title;
	}

	get Source(): string[] | undefined {
		return this.#source;
	}

	set Source(source: string[] | undefined) {
		this.#source = source;
	}

	get Data(): Details[] | undefined {
		return this.#data;
	}

	set Data(details: Details[] | undefined) {
		this.#data = details;
	}

	get Ai(): string[] | undefined {
		return this.#ai;
	}

	set Ai(ai: string[] | undefined) {
		this.#ai = ai;
	}

	compareTo(that: HackerNews): number {
		return Number(this.Pubdate) - Number(that.Pubdate);
	}
}
