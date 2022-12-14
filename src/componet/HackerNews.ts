import path from "path";
import async from "async";
import { Utils, fetchJson } from "./utils";
import { JsonData } from "../types/type";
import { Comment } from "./comment";
import { Markdown } from "./markdown";
import { Api, ApiData } from "./api";
import { SourceLink } from "./source_link";
import { Collect } from "./collect";

interface Response {
	code: number;
	message: string;
	ttl: number;
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: { [key: string]: any };
}

export class HackerNews {
	params: { [key: string]: string | number };
	data_path?: string;
	json_data?: JsonData;
	bvids?: string[];
	api_data: ApiData;

	comment: Comment;
	utils: Utils = new Utils();
	source_link: SourceLink;
	markdown: Markdown;
	collect: Collect;

	constructor() {
		this.params = {};
		this.init();

		const api = new Api();
		this.api_data = api.data;

		let api_data = this.api_data;
		let json_data = this.json_data!;

		this.utils = new Utils();
		this.comment = new Comment(api_data);
		this.source_link = new SourceLink(api_data);
		this.markdown = new Markdown(json_data!);
		this.collect = new Collect(api_data);
	}

	init(): void {
		this.data_path = path.join(__dirname, "../data/data.json");
		let data_str = this.utils.readFile(this.data_path);
		this.json_data = JSON.parse(data_str);
		this.bvids = Object.keys(this.json_data!);
	}

	getAids(): string[] {
		let aids: string[] = [];
		for (let bvid in this.json_data) {
			let aid = this.json_data[bvid]["aid"]!;
			aids.push(aid.toString());
		}

		return aids;
	}

	writeJson(data: JsonData): void {
		let sort_data = this.utils.sortJson(data, "pubdate");
		this.utils.writeFile(this.data_path!, sort_data);
		this.init();
	}

	getCollectInfo(): void {
		let json_data = this.json_data!;
		const collect = this.collect;

		let urls = collect.initUrl();

		async.mapLimit(urls, 5, fetchJson, (err, results) => {
			if (err) {
				throw new Error(`${err}`);
			} else {
				results?.forEach((data: Response, index) => {
					let ids_data = data["data"];
					ids_data?.["archives"].forEach(
						// rome-ignore lint/suspicious/noExplicitAny: <explanation>
						(value: { [key: string]: any }, _: number) => {
							let data = {
								title: value["title"],
								aid: value["aid"],
								bvid: value["bvid"],
								pubdate: value["pubdate"],
							};
							collect.checkCollect(json_data, data);
						},
					);
					this.writeJson(json_data);
				});
			}
		});
	}

	getSourceLinks() {
		let json_data = this.json_data!;
		const source_link = this.source_link;
		let newBvids = source_link.checkSourceLink(json_data);

		let urls = source_link.initUrls(newBvids);
		let that = this;
		async.mapLimit(urls, 5, fetchJson, (err, results) => {
			if (err) {
				throw new Error(`${err}`);
			} else {
				results?.forEach((value, index) => {
					let data = value["data"];
					let desc: string = data["desc"];

					let links = that.source_link.captureLink(desc);
					let bvid = newBvids[index];
					json_data[bvid]["source"] = links;

					that.writeJson(json_data);
				});
			}
		});
	}

	getComment(): void {
		if (!this.bvids) {
			this.getCollectInfo();
			this.init();
		}

		const comment = this.comment;
		let jsonData = this.json_data!;
		let { newAids, newBvids } = comment.checkCommitData(jsonData);

		let that = this;

		let urls = comment.initUrl(newAids);

		async.mapLimit(urls, 5, fetchJson, (err, results) => {
			if (err) {
				throw err;
			} else {
				// results is now an array of the response bodies
				let json_data = that.json_data!;
				results?.forEach((result: Response, index) => {
					let bvid = newBvids[index];
					let data = result["data"];
					let message = that.comment.getTopCommit(data, bvid);
					let intro_data = that.comment.parseComment(message);
					json_data[bvid]["data"] = intro_data;

					that.writeJson(json_data);
				});
			}
		});
	}

	updateReadme(readme_path: string, md_path: string): void {
		this.init();
		let markdown = this.markdown;
		let docs = markdown.generateMd(md_path);
		let title =
			"# Koala Hacker News\n b 站 up 主 [Koala 聊开源](https://space.bilibili.com/489667127) 的《Hacker News 周报》[合集](https://space.bilibili.com/489667127/channel/collectiondetail?sid=249279) 的内容总结\n";

		let contents = "\n## 目录\n\n";
		let chapters = "";
		docs.pub_dates.forEach((value, index) => {
			let doc_path = docs["paths"][index];
			let re_path = path.relative(path.dirname(readme_path), doc_path);
			let new_path = re_path.replace(/\\/g, "/");
			chapters += `- [${value}: [Hacker News 周报]](${new_path})\n`;
		});

		let file_end =
			"\n## 参考\n\n - [bilibili-api-collect](https://github.com/SocialSisterYi/bilibili-API-collect)";

		let readme = `${title}${contents}${chapters}${file_end}`;
		this.utils.writeFile(readme_path, readme);
	}
}
