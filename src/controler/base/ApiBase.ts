/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : ApiBase.ts
 *   Last Modified : 2023-08-10 10:42:58
 *   Describe      :
 *
 * ====================================================
 */

import path from "path";
import JSON5 from "json5";
import { Utils } from "../../common/utils";

export interface ApiData {
	collect: ApiParams;
	comment: ApiParams;
	video_info: ApiParams;
}

interface ApiParams {
	url: URL;
	params: URLSearchParams;
}

export class ApiBase {
	static init(): ApiData {
		const api_path = path.join(__dirname, "../../data/bilibili-api.jsonc");
		const api_data = JSON5.parse(Utils.readFile(api_path));
		return api_data;
	}
}
