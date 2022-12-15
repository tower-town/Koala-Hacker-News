import { Api, ApiData } from "./api";
import { Utils } from "./utils";
import { JsonData } from "../types/type";

export class SourceLink extends Api {
	constructor() {
		super();
	}

	initUrls(bvids: string[]): URL[] {
		let info_api = this.data["video_info"];
		let url = new URL(info_api["url"]);
		let params = new URLSearchParams(info_api["params"]);
		let urls: URL[] = [];
		bvids.forEach((bvid, index) => {
			params.set(bvid, bvid);
			urls.push(Utils.parseUrl(url, params));
		});

		return urls;
	}

	checkSourceLink(json_data: JsonData): string[] {
		let bvids: string[] = [];
		for (let bvid in json_data) {
			if (!json_data[bvid]["source"]) {
				bvids.push(bvid);
			}
		}
		return bvids;
	}

	captureLink(content: string): string[] {
		let links: string[] = [];
		const regexp = /(?:.*)(https?:\/\/\S+)(?:\s+)?/g;
		let captures = [...content.matchAll(regexp)][0];
		links = [...captures.slice(1)];
		return links;
	}
}
