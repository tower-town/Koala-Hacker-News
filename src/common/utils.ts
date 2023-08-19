import fs from "fs";
import { Sort } from "./sort";
import { JsonData, Response } from "../types/type";

export class Utils {
	constructor() {}
	static sortJson(json_data: JsonData, keyword: keyof JsonData[string]) {
		const pubdates_dict: { [data: string]: string } = {};
		const sort_data: JsonData = {};

		for (const key in json_data) {
			const index = json_data[key][keyword]!;
			pubdates_dict[index.toString()] = key;
		}

		const pubdates = Object.keys(pubdates_dict);
		const right_index = pubdates.length - 1;
		const sort = new Sort({ flag: false });
		sort.quicksort(pubdates, 0, right_index);

		pubdates.forEach((pubdate, _) => {
			const key = pubdates_dict[pubdate];
			sort_data[key] = json_data[key];
		});

		return sort_data;
	}

	static parseUrl(url: URL, params: URLSearchParams): URL {
		const url_params = new URL(`${url.toString()}?${params.toString()}`);
		return url_params;
	}

	static readFile(path: fs.PathLike): string {
		let data = "{}";
		try {
			data = fs.readFileSync(path, "utf-8");
		} catch (err) {
			throw new Error(`no such file: ${path}\n${err}`);
		}
		return data;
	}

	/*
	rewreite follow  writeFile function aim to support check string if it's null.
	*/

	static writeFile(
		path: fs.PathLike,
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		data: { [key: string]: any } | string,
	): void {
		let file_data = "";

		if (typeof data === "object") {
			file_data = JSON.stringify(data, null, 4);
		} else {
			file_data = data;
		}

		if (file_data === "") {
			file_data = "{}";
		}
		fs.writeFile(path, (data = file_data), (error) => {
			if (error) {
				throw new Error(`${path}\n${error}`);
			}
		});
	}
}

export async function fetchJson(urls: URL[]): Promise<Promise<Response>[]> {
	const jsonPromises: Promise<Response>[] = urls.map(async (url) => {
		try {
			const response = await fetch(url);
			return response.json();
		} catch (err) {
			throw err;
		}
	});

	return jsonPromises;
}
