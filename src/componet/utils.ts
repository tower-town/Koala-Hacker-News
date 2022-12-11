import * as fs from "fs";
import { Sort } from "./sort";
import { JsonData } from "../types/type";

export class Utils {
	constructor() {}
	sort_json(json_data: JsonData, keyword: keyof JsonData[string]) {
		let pubdates_dict: { [data: string]: string } = {};
		let sort_data: JsonData = {};

		for (let key in json_data) {
			let index = json_data[key][keyword]!;
			pubdates_dict[index.toString()] = key;
		}

		let pubdates = Object.keys(pubdates_dict);
		let right_index = pubdates.length - 1;
		let sort = new Sort(false);
		sort.quicksort(pubdates, 0, right_index);

		pubdates.forEach((pubdate, _) => {
			let key = pubdates_dict[pubdate];
			sort_data[key] = json_data[key];
		});

		return sort_data;
	}

	parse_url(url: URL, params: {[param:string]: string | number}): URL {
		let params_keys = Object.keys(params);

		params_keys.forEach((value, index) => {
			params_keys[index] = `${value}=${params[value]}`;
		});
		let url_params = `${url}?${params_keys.join("&")}` as unknown as URL;
		return url_params;
	}

	read_file(path: fs.PathLike): string {
		let data = "{}";
		try {
			data = fs.readFileSync(path, "utf-8");
		} catch (err) {
			throw new Error(`no such file: ${path}\n${err}`);
		}
		return data;
	}

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	write_file(path: fs.PathLike, data: { [key: string]: any } | string): void {
		let file_data = "";

		if (typeof data === "object") {
			file_data = JSON.stringify(data, null, 4);
		} else {
			file_data = data;
		}

		if (!file_data) {
			file_data = "{}";
		}
		fs.writeFile(path, (data = file_data), (error) => {
			if (error) {
				throw new Error(`${path}\n${error}`);
			}
		});
	}
}

export async function fetchjson(url: URL) {
	const response = await fetch(url);
	return response.json();
}