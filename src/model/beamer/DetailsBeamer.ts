/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : IntroData.ts
 *   Last Modified : 2023-08-09 23:32:47
 *   Describe      :
 *
 * ====================================================
 */

export class DetailsBeamer {
	#name: string;
	#intro: string;
	#link: string;

	constructor(name: string, intro: string, link: string) {
		this.#name = name;
		this.#intro = intro;
		this.#link = link;
	}

	get Name(): string {
		return this.#name;
	}

	set Name(name: string) {
		this.#name = name;
	}

	get Intro(): string {
		return this.#intro;
	}

	set Intro(intro: string) {
		this.#intro = intro;
	}

	get Link(): string {
		return this.#link;
	}

	set Link(link: string) {
		this.#link = link;
	}
}
