import path from "path";
import JSON5 from "json5";
import { Utils } from "./utils";

export interface ApiData {
	collect: ApiParams;
	comment: ApiParams;
	video_info: ApiParams;
}

interface ApiParams {
	url: URL;
	params: URLSearchParams;
}

export class Api {
	data: ApiData;
	constructor() {
		this.data = this.init();
	}

	init(): ApiData {
		const api_path = path.join(__dirname, "../data/bilibili-api.jsonc");
		const api_data = JSON5.parse(Utils.readFile(api_path));
		return api_data;
	}
}
