import { Utils } from "./utils";
import { IntroData, JsonData } from "../types/type";
import { ApiData } from "./api";
import path from "path";

interface NoteData {
	[bvid: string]: {
		data: IntroData[];
	};
}

export class Comment {
	api_data: ApiData;
	mid: string;
	constructor(api_data: ApiData) {
		this.mid = "489667127";
		this.api_data = api_data;
	}

	initUrl(aids: string[]): URL[] {
		let api_data = this.api_data["comment"];
		let api_params = api_data["params"];

		let urls: URL[] = [];

		aids.forEach((aid) => {
			api_params["oid"] = aid;
			let url = Utils.parseUrl(api_data["url"], api_params);
			urls.push(url);
		});

		return urls;
	}

	checkCommitData(jsonData: JsonData) {
		let newAids: string[] = [];
		let newBvids: string[] = [];

		for (let bvid in jsonData) {
			if (!jsonData[bvid]["data"]) {
				newAids.push(jsonData[bvid]["aid"].toString());
				newBvids.push(bvid);
			}
		}
		return {
			newAids: newAids,
			newBvids: newBvids,
		};
	}
	getTopCommit(
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		comment: { [key: string]: any },
		bvid: string,
	): {
		bvid: string;
		list: string[];
	} {
		let mid = this.mid;
		let top = {
			comment: comment["top"]["upper"],
			reply: comment["replies"][0],
		};

		let message = {
			content: "",
			comment: "",
			reply: "",
			dict: {
				bvid: bvid,
				list: [""],
			},
		};

		message["dict"]["list"] = [];

		if (top["comment"] === null) {
			message["comment"] = "";
			if (top["reply"]["member"]["mid"] === mid) {
				message["reply"] = top["reply"]["content"]["message"];
			}
		} else {
			message["comment"] = top["comment"]["content"]["message"];
			if (top["comment"]["replies"] !== null) {
				message["reply"] = top["comment"]["replies"][0]["content"]["message"];
			}
		}

		message["content"] = `${message["comment"]}\n${message["reply"]}`;

		message["content"].split("\n").forEach((value, _) => {
			message["dict"]["list"].push(value.trim());
		});

		return message["dict"];
	}

	parseComment(message: {
		bvid: string;
		list: string[];
	}): {
		name: string;
		intro: string;
		link: string;
	}[] {
		let message_data = message["list"].filter((value) =>
			/^[0-9hw].*/.test(value),
		);

		let bvid = message["bvid"];
		let note_path = path.join(__dirname, "../data/note.json");
		let note_data: NoteData = JSON.parse(Utils.readFile(note_path));

		for (let key in note_data) {
			if (message["bvid"] === key) {
				return note_data[key]["data"];
			}
		}

		let intro = {
			data: [
				{
					name: "",
					intro: "",
					link: "",
				},
			],
			name: [""],
			link: [""],
			content: [""],
		};

		intro["name"] = [];
		intro["link"] = [];
		intro["content"] = [];

		message_data.forEach((intro_str, index) => {
			if (/^https?:\/\/\S+/.test(intro_str)) {
				intro["link"].push(intro_str);
			} else {
				let capture = this.captureNameIntro(intro_str, bvid);
				intro["name"].push(capture["name"]);
				intro["content"].push(capture["intro"]);
			}
		});
		intro["name"].forEach((value, index) => {
			if (!intro["link"][index]) {
				intro["link"][index] = "";
			}
			intro["data"][index] = {
				name: value.trim(),
				intro: intro["content"][index].trim(),
				link: intro["link"][index].trim(),
			};
		});
		return intro["data"];
	}

	captureNameIntro(
		intro_str: string,
		bvid: string,
	): { name: string; intro: string } {
		const regexp = /\d{2}:\d{2}(?:\s+)?([^｜|，,]+)?([｜\|，,])?(.+$)/g;
		let value = intro_str;
		let capture = {
			name: "",
			intro: "",
		};

		let captures = [...value.matchAll(regexp)][0];
		if (captures) {
			if (captures[2]) {
				capture["name"] = captures[1] || "";
				capture["intro"] = captures[3];
			} else {
				capture["name"] = "";
				capture["intro"] = captures[1] + captures[3];
			}
		} else {
			console.warn(`warning: escaple capture is ${value} in ${bvid}`);
		}
		return capture;
	}
}
