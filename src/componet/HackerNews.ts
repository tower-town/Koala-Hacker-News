import path from "path";
import { Utils, fetchJson } from "./utils";
import { JsonData } from "../types/type";
import { Comment } from "./comment";
import { Markdown } from "./markdown";
import { SourceLink } from "./source_link";
import { Collect } from "./collect";
import util from "util";
import fs from "fs";

export class HackerNews {
	jsonPath: string;
	json_data?: JsonData;
	bvids?: string[];

	comment: Comment;
	source_link: SourceLink;
	markdown: Markdown;
	collect: Collect;

	constructor({ jsonPath = path.join(__dirname, "../data/data.json") } = {}) {
		this.jsonPath = jsonPath;
		this.init();
		let json_data = this.json_data!;

		this.comment = new Comment();
		this.source_link = new SourceLink();
		this.markdown = new Markdown(json_data!);
		this.collect = new Collect();
	}

	init(): void {
		let data_str = Utils.readFile(this.jsonPath);
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

	async writeJson(jsonData: JsonData, jsonPath = this.jsonPath): Promise<void> {
		try {
			let jsonStr = JSON.stringify(jsonData, null, 4);
			let filePromise = util.promisify(fs.writeFile);
			await filePromise(jsonPath, jsonStr);
		} catch (err) {
			console.trace(`error: ${err}`);
		} finally {
			let initPromise = util.promisify(this.init);
		}
	}

	async initCollect(): Promise<JsonData> {
		let jsonData = this.json_data!;
		const collect = this.collect;
		let urls = collect.initUrl();
		let responsePromises = await fetchJson(urls);
		for (const responsePromise of responsePromises) {
			try {
				let results = await responsePromise;
				let dataset: Record<string, any>[] = results["data"]["archives"];
				dataset?.forEach((data) => {
					let collectInfo = {
						title: data["title"],
						aid: data["aid"],
						bvid: data["bvid"],
						pubdate: data["pubdate"],
					};
					collect.checkCollect(jsonData, collectInfo);
				});
			} catch (err) {
				throw err;
			}
		}
		jsonData = Utils.sortJson(jsonData, "pubdate");
		return jsonData;
	}

	async getSourceLinks(): Promise<JsonData> {
		let json_data = this.json_data!;
		const source_link = this.source_link;
		let newBvids = source_link.checkSourceLink(json_data);

		let urls = source_link.initUrls(newBvids);

		let responsePromises = await fetchJson(urls);
		for (let [index, results] of responsePromises.entries()) {
			try {
				let result = await results;
				let data = result["data"];

				let desc: string = data["desc"];
				let links = source_link.captureLink(desc);
				let bvid = newBvids[index];
				json_data[bvid]["source"] = links;
			} catch (err) {
				throw err;
			}
		}
		return json_data;
	}

	async getComment(): Promise<JsonData> {
		const comment = this.comment;
		let jsonData = this.json_data!;
		let { newAids, newBvids } = comment.checkCommitData(jsonData);

		let urls = comment.initUrl(newAids);

		let responsePromises = await fetchJson(urls);
		for (let [index, results] of responsePromises.entries()) {
			try {
				let result = await results;
				let data = result["data"];
				let bvid = newBvids[index];

				let message = comment.getTopCommit(data, bvid);
				let intro_data = comment.parseComment(message);
				jsonData[bvid]["data"] = intro_data;
			} catch (err) {
				throw err;
			}
		}
		return jsonData;
	}

	async updateReadme(readme_path: string, md_path: string): Promise<void> {
		let markdown = this.markdown;
		markdown.json_data = this.json_data!;

		let tables = await markdown.generateTables();
		let doc = await markdown.generateDocs(tables);
		let docs = await markdown.generateMd(md_path, doc);
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
		let filePromise = util.promisify(fs.writeFile);
		await filePromise(readme_path, readme);
	}
}
