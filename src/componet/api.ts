import * as path from "path";
import { Utils } from "./utils";

export interface ApiData {
	get_aids: ApiParams;
	get_comment: ApiParams;
	video_info: ApiParams;
}

interface ApiParams {
	url: URL;
	params: {
		[param: string]: string | number;
	};
}

export class Api {
	data: ApiData;
	constructor() {
		this.data = this.init();
	}

	init(): ApiData {
		let utils = new Utils();
		let api_path = path.join(__dirname, "../data/bilibili-api.json");
		let api_data = JSON.parse(utils.read_file(api_path));
		return api_data;
	}
}
