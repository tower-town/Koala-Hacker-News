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

import { DetailsJson } from "@src/common/type";
import { DetailsBeamer } from "../beamer/DetailsBeamer";

export interface DetailsDAO {
	getList(intro: DetailsJson[]): DetailsBeamer[];
}
