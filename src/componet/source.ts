import { Api, ApiData } from "./api";
import { Utils, fetchjson } from "./utils";
import * as async from "async";
import { JsonData } from "../types/type";

export class Source {
	api_data: ApiData;
	json_data?: JsonData;
	json_path?: string;
	constructor() {
		let api = new Api();
		this.api_data = api.data;
	}

	init_source(bvids: string[]): URL[] {
		let utils = new Utils();
		let info_api = this.api_data["video_info"];
		let url = info_api["url"];
		let params = info_api["params"];
		let urls: URL[] = [];
		bvids.forEach((bvid, index) => {
			params["bvid"] = bvid;
			urls.push(utils.parse_url(url, params));
		});

		return urls;
	}

	get_sources(bvids: string[]) {
		let urls = this.init_source(bvids);
		let that = this;
		async.mapLimit(urls, 5, fetchjson, (err, results) => {
			if (err) {
				throw new Error(`${err}`);
			} else {
				let source_data: JsonData = {};
				let json_path: string = "";

				results?.forEach((value, index) => {
					let data = value["data"];
					let desc: string = data["desc"];

					let links = that.capture_link(desc);
					let bvid = bvids[index];
					if (that.json_data) {
						source_data = that.json_data;

						source_data[bvid]["source"] = links;
						json_path = that.json_path!;
					}
				});

				if (this.json_data) {
					that.write_source(source_data, json_path);
				}
			}
		});
	}

	write_source(source_data: JsonData, json_path: string): void {
		let utils = new Utils();
		
		utils.write_file(json_path, source_data);
	}

	capture_link(content: string): string[] {
		let links: string[] = [];
		const regexp = /(?:.*)(https:\/\/\S+)(?:\s+)?/g;
		let captures = [...content.matchAll(regexp)][0];
		links = [...captures.slice(1)];
		return links;
	}
}
