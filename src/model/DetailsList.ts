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

import { DetailsJson } from "@src/common/type";
import { DetailsDAO } from "./DAO/DetailsDAO";
import { BaseDAO } from "./base/BaseDAO";
import { DetailsBeamer } from "./beamer/DetailsBeamer";

export class DetailsList extends BaseDAO implements DetailsDAO {
	getList(intro: DetailsJson[] | undefined): DetailsBeamer[] {
		const details: DetailsBeamer[] = [] as DetailsBeamer[];
		intro?.forEach((v, _) => {
			details.push(new DetailsBeamer(v.name, v.intro, v.link));
		});
		return details;
	}

	getObj(details: DetailsBeamer[]): DetailsJson[] {
		const intro: DetailsJson[] = [] as DetailsJson[];
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
