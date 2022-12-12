import { ApiData } from "./api";
import { Utils } from "./utils";

export class SourceLink {
	api_data: ApiData;
	constructor(api_data: ApiData) {
		this.api_data = api_data;
	}

	init_urls(bvids: string[]): URL[] {
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


	capture_link(content: string): string[] {
		let links: string[] = [];
		const regexp = /(?:.*)(https:\/\/\S+)(?:\s+)?/g;
		let captures = [...content.matchAll(regexp)][0];
		links = [...captures.slice(1)];
		return links;
	}
}
