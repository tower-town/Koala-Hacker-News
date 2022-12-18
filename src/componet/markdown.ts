import { JsonData } from "../types/type";
import { Utils } from "./utils";
import path from "path";
import format from "html-format";
import util from "util";

interface Tables {
	content: string[];
	tr: string[];
	title: {
		content: string[];
		link: string[];
		pubdate: string[];
	};
}

export class Markdown {
	json_data: JsonData;

	constructor(data: JsonData) {
		this.json_data = data;
	}
	generateTables(): Promise<Tables> {
		return new Promise((resolve, reject) => {
			let data_keys = Object.keys(this.json_data!);
			let tables: Tables = {
				content: [],
				tr: [],
				title: {
					content: [],
					link: [],
					pubdate: [],
				},
			};

			data_keys.forEach((value, index) => {
				let data = this.json_data?.[value]!;
				let title_item = data["title"];
				let title_link = `https://www.bilibili.com/video/${value}`;
				let title_pubdate = data["pubdate"].toString();
				tables["title"]["content"].push(title_item);
				tables["title"]["link"].push(title_link);
				tables["title"]["pubdate"].push(title_pubdate);

				if (data["data"]!) {
					let tr_item = "";
					data["data"].forEach((item, _) => {
						tr_item += `
                <tr>
                    <td>${item["name"]}</td>
                    <td>${item["intro"]}</td>
                    <td>${item["link"]}</td>
                </tr>
            `.trim();
					});
					tables["tr"].push(tr_item);
				}
			});

			let table_hander = `
            <theader>
                <th>名称</th>
                <th>简介</th>
                <th>链接</th>
            </theader>
        `.trim();

			tables["title"]["content"].forEach((item, index) => {
				let table_body = `
            <tbody>
                ${tables["tr"][index]}
            </tbody>
        `.trim();
				let table = `
            [${item}](${tables["title"]["link"][index]})
            <table>
                ${table_hander}
                ${table_body}
            </table>
        `.trim();
				tables["content"].push(format(table));
			});

			resolve(tables);
		});
	}

	generateDocs(tables: Tables): Promise<Record<string, string[]>> {
		return new Promise((resolve, reject) => {
			let content = tables["content"];
			let pubdates = tables["title"]["pubdate"];

			let docs: { [pub_date: string]: string[] } = {};
			let pub_list: string[] = [];

			let state: string = "";
			pubdates.sort((a, b) => {
				return Number(b) - Number(a);
			});
			pubdates.forEach((value, index) => {
				let date = new Date(Number(value) * 1000);
				let pub_date = `${date.getFullYear()}-${date.getMonth() + 1}`;
				if (state !== pub_date) {
					if (pub_list.length !== 0) {
						docs[state] = pub_list;
						pub_list = [];
					}
					state = pub_date;
				}
				if (value === pubdates[pubdates.length - 1]) {
					docs[pub_date] = pub_list;
				}
				pub_list.push(content[index]);
			});

			resolve(docs);
		});
	}

	generateMd(
		md_path: string,
		docs: Record<string, string[]>,
	): Promise<{
		pub_dates: string[];
		paths: string[];
	}> {
		return new Promise((resolve, reject) => {
			let file = {
				name: "",
				content: "",
				path: "",
			};

			let docs_keys = Object.keys(docs);
			let paths: string[] = [];
			docs_keys.forEach((key, _) => {
				file["name"] = `${key}-Hacker-News.md`;
				file["content"] = docs[key].join("\n\n");
				file["path"] = path.join(md_path, file["name"]);

				if (docs[key].length === 0) {
					console.log(docs[key]);
				}
				paths.push(file["path"]);
				Utils.writeFile(file["path"], file["content"]);
			});

			let result = {
				pub_dates: docs_keys,
				paths: paths,
			};
			resolve(result);
		});
	}
}
