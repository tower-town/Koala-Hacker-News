import { Utils } from "./utils";
import { IntroData } from "../types/type";
import * as path from "path";

interface NoteData {
	[bvid: string]: {
		data: IntroData[];
	};
}

export class Comment{
	utils: Utils = new Utils();
    constructor(){
		this.utils = new Utils();
    }

	get_top_commment(
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		comment: { [key: string]: any },
		bvid: string,
	): {
		bvid: string;
		list: string[];
	} {
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
			if (top["reply"]["member"]["mid"] === "489667127") {
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

	parse_comment(message: {
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

		let note_path = path.join(__dirname, "../data/note.json");
		let note_data: NoteData = JSON.parse(this.utils.read_file(note_path));

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

		message_data.forEach((value, index) => {
			let name = "";
			let content = "";

			if (/^https?:\/\/\S+/.test(value)) {
				intro["link"].push(value);
			} else {
				const regexp =
					/\d{2}:\d{2}(?:\s+)?([^｜|，,]+)?([｜\|，,])?(.+$)/g;
				let captures = [...value.matchAll(regexp)][0];
				if (captures) {
					if (captures[2]) {
						name = captures[1] || "";
						content = captures[3];
					} else {
						name = "";
						content = captures[1] + captures[3];
					}
				} else {
					console.warn(
						`warning: escaple capture is ${value} in ${message["bvid"]}`,
					);
				}
				intro["name"].push(name);
				intro["content"].push(content);
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
}