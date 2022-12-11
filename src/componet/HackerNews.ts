import * as path from "path";
import * as async from "async";
import { Utils } from "./utils";
import { JsonData } from "../types/type";
import { Comment } from "./comment";
import { Markdown } from "./markdown";

interface Api {
	[type: string]: {
		url: URL;
		params: { [param: string]: string | number };
	};
}

interface Response {
	code: number;
	message: string;
	ttl: number;
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: { [key: string]: any };
}


export class HackerNews {
	url?: URL;
	params: { [key: string]: string | number };
	utils: Utils = new Utils();
	data_path?: string;
	json_data?: JsonData;
	bvids?: string[];
	api_path?: string;
	api_data?: Api;
	comment: Comment = new Comment();

	constructor() {
		this.params = {};
		this.utils = new Utils();
		this.comment = new Comment();
		this.init();
	}

	init(): void {
		this.data_path = path.join(__dirname, "../data/data.json");

		this.json_data = JSON.parse(this.utils.read_file(this.data_path));
		this.bvids = Object.keys(this.json_data!);

		this.api_path = path.join(__dirname, "../data/bilibili-api.json");
		this.api_data = JSON.parse(this.utils.read_file(this.api_path));
	}

	get_aids(): void {
		let api_data = this.api_data?.["get_aids"]!;
		this.url = api_data["url"]!;
		this.params = api_data["params"];
		let that = this;

		let urls: URL[] = [];
		urls.push(this.utils.parse_url(this.url!, this.params));

		async.mapLimit(
			urls,
			5,
			async function (url: URL) {
				const response = await fetch(url);
				return response.json();
			},
			(err, results) => {
				if (err) {
					throw new Error(`${err}`);
				}

				let video_info = this.json_data!;
				results?.forEach((data: Response, index) => {
					let ids_data = data["data"];
					ids_data?.["archives"].forEach(
						// rome-ignore lint/suspicious/noExplicitAny: <explanation>
						(value: { [key: string]: any }, _: number) => {
							let bvid = value["bvid"];
							video_info[bvid] = {
								title: value["title"],
								aid: value["aid"],
								bvid: value["bvid"],
								pubdate: value["pubdate"],
							};
						},
					);

					let sort_data = this.utils.sort_json(video_info, "pubdate");
					that.utils.write_file(this.data_path!, sort_data);
				});
			},
		);
	}


	get_comment(): void {
		let comment_data = this.api_data?.["get_comment"]!;
		let comment_params = comment_data["params"];
		let that = this;

		if (!this.bvids) {
			this.get_aids();
			this.init();
		}

		let aids: { [key: string]: string } = {};
		this.bvids?.forEach((value, _) => {
			let aid = this.json_data?.[value]?.["aid"]!;
			aids[aid.toString()] = value;
		});

		let urls: URL[] = [];
		let aids_key = Object.keys(aids);
		aids_key.forEach((value, _) => {
			comment_params["oid"] = value;
			let url = this.utils.parse_url(comment_data["url"], comment_params);
			urls.push(url);
		});

		async.mapLimit(
			urls,
			5,
			async function (url: URL) {
				const response = await fetch(url);
				return response.json();
			},
			(err, results) => {
				if (err) {
					throw err;
				}
				// results is now an array of the response bodies
				let video_info = that.json_data!;
				results?.forEach((value: Response, index) => {
					let aid_key = aids_key[index];
					let bvid = aids[aid_key];
					let data = value["data"];
					let message = that.comment.get_top_commment(data, bvid);
					let intro_data = that.comment.parse_comment(message);
					video_info[bvid]["data"] = intro_data;

					let sort_data = this.utils.sort_json(video_info, "pubdate");
					that.utils.write_file(this.data_path!, sort_data);
				});
			},
		);
	}

	update_readme(readme_path: string, md_path: string) {
		this.init();
		let markdown = new Markdown(this.json_data!);
		let docs = markdown.generate_md(md_path);
		let title =
			"# Koala Hacker News\n b 站 up 主 [Koala 聊开源](https://space.bilibili.com/489667127) 的《Hacker News 周报》[合集](https://space.bilibili.com/489667127/channel/collectiondetail?sid=249279) 的内容总结\n";

		let contents = "\n## 目录\n\n";
		let chapters = "";
		docs.pub_dates.forEach((value, index) => {
			let doc_path = docs["paths"][index];
			let re_path = path.relative(path.dirname(readme_path), doc_path);
			let new_path = re_path.replaceAll("\\", "/");
			chapters += `- [${value}: [Hacker News 周报]](${new_path})\n`;
		});

		let file_end =
			"\n## 参考\n\n - [bilibili-api-collect](https://github.com/SocialSisterYi/bilibili-API-collect)";

		let readme = `${title}${contents}${chapters}${file_end}`;
		this.utils.write_file(readme_path, readme);
	}
}