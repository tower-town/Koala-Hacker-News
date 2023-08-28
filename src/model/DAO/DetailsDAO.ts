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

import { IntroJson } from "../../common/type";
import { Details } from "../beamer/Details";

export interface DetailsDAO {
	getList(intro: IntroJson[]): Details[];
}
