/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : IntroDataDAO.ts
 *   Last Modified : 2023-08-10 15:55:52
 *   Describe      :
 *
 * ====================================================
 */

import { IntroData } from "../../types/type";
import { Details } from "../beam/Details";

export interface DetailsDAO {
	addDetails(details: Details): void;

	updateDetails(introData: IntroData): void;

	get DetailsList(): Details[];

	getDetailsList(introData: IntroData[]): Details[];
}
