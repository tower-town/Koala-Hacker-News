/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : IntroDataImpl.ts
 *   Last Modified : 2023-08-10 16:02:34
 *   Describe      :
 *
 * ====================================================
 */

import { IntroData } from "../../types/type";
import { DetailsDAO } from "../DAO/DetailsDAO";
import { BaseDAO } from "../base/BaseDAO";
import { Details } from "../beam/Details";

export class DetailsImpl extends BaseDAO implements DetailsDAO {
	addDetails(details: Details): void {
		throw new Error("Method not implemented.");
	}

	updateDetails(introData: IntroData): void {
		throw new Error("Method not implemented.");
	}

	get DetailsList(): Details[] {
		throw new Error("Method not implemented.");
	}

	getDetailsList(introData: IntroData[]): Details[] {
		const details: Details[] = [] as Details[];
		introData.forEach((v, _) => {
			details.push(new Details(v.name, v.intro, v.link));
		});
		return details;
	}
}
