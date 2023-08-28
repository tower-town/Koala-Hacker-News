/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : DetailsList.ts
 *   Last Modified : 2023-08-25 18:03:48
 *   Describe      :
 *
 * ====================================================
 */

import { IntroJson } from "../common/type";
import { DetailsDAO } from "./DAO/DetailsDAO";
import { BaseDAO } from "./base/BaseDAO";
import { Details } from "./beamer/Details";

export class DetailsList extends BaseDAO implements DetailsDAO {
	getList(intro: IntroJson[] | undefined): Details[] {
		const details: Details[] = [] as Details[];
		intro?.forEach((v, _) => {
			details.push(new Details(v.name, v.intro, v.link));
		});
		return details;
	}

	getObj(details: Details[]): IntroJson[] {
		const intro: IntroJson[] = [] as IntroJson[];
		details.forEach((v, _) => {
			intro.push({
				name: v.Name,
				intro: v.Intro,
				link: v.Link,
			})
		});
		return intro;
	}
}
