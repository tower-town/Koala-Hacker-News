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

import { DetailsBeamer } from "./DetailsBeamer";

export class HackerNewsBeamer {
	#bvid: string;
	#aid: number;
	#title: string;
	#pubdate: number;
	#source?: string[];
	#details?: DetailsBeamer[];
	#ai?: string[];

	constructor(
		bvid: string,
		title: string,
		aid: number,
		pubdate: number,
		source?: string[],
		details?: DetailsBeamer[],
		ai?: string[],
	) {
		this.#bvid = bvid;
		this.#aid = aid;
		this.#title = title;
		this.#pubdate = pubdate;
		this.#source = source;
		this.#details = details;
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

	get Details(): DetailsBeamer[] | undefined {
		return this.#details;
	}

	set Details(details: DetailsBeamer[] | undefined) {
		this.#details = details;
	}

	get Ai(): string[] | undefined {
		return this.#ai;
	}

	set Ai(ai: string[] | undefined) {
		this.#ai = ai;
	}

	compareTo(that: HackerNewsBeamer): number {
		return Number(this.Pubdate) - Number(that.Pubdate);
	}
}
