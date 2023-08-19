import { JsonData, BvidData } from "../types/type";
import { Api } from "./api";
import { Utils } from "./utils";

export class Collect extends Api {
	constructor() {
		super();
	}

	initUrl() {
		const api_data = this.data["collect"]!;
		const url = new URL(api_data["url"]);
		const params = new URLSearchParams(api_data["params"]);

		const urls: URL[] = [];
		urls.push(Utils.parseUrl(url, params));

		return urls;
	}

	checkCollect(json_data: JsonData, data: BvidData) {
		const { bvid } = data;

		if (!json_data[bvid]) {
			json_data[bvid] = data;
		}
	}
}
