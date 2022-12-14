import { JsonData, BvidData } from "../types/type";
import { ApiData } from "./api";
import { Utils } from "./utils";

export class Collect {
	apiData: ApiData;
	constructor(api_data: ApiData) {
		this.apiData = api_data;
	}

	initUrl() {
		let api_data = this.apiData["collect"]!;
		let url = api_data["url"];
		let params = api_data["params"];

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
