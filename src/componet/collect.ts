import { JsonData, BvidData } from "../types/type";
import { Api, ApiData } from "./api";
import { Utils } from "./utils";

export class Collect extends Api {
	constructor() {
		super();
	}

	initUrl() {
		let api_data = this.data["collect"]!;
		let url = new URL(api_data["url"]);
		let params = new URLSearchParams(api_data["params"]);

		let urls: URL[] = [];
		urls.push(Utils.parseUrl(url, params));

		return urls;
	}

	checkCollect(json_data: JsonData, data: BvidData) {
		let { bvid } = data;
		if (!json_data[bvid]) {
			json_data[bvid] = data;
		}
	}
}
