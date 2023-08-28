/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : BaseDAO.ts
 *   Last Modified : 2023-08-10 11:29:46
 *   Describe      :
 *
 * ====================================================
 */

import { Utils } from "../../common/utils";

export abstract class BaseDAO {
	readData<T>(filePath: string): T {
		const jsonStr = Utils.readFile(filePath);
		return JSON.parse(jsonStr);
	}

	async writeData<T>(filePath: string, data: T): Promise<void> {
		const dataJson = JSON.stringify(data, null, 4);
		Utils.writeFile(filePath, dataJson);
	}
}
