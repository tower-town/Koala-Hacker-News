import fs from "fs";
import { JsonData, Response } from "../types/type";

export class Utils {

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

	static async writeFile(
		path: fs.PathLike,
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		data: Record<string, any>[] | string,
	): Promise<void> {
		let data_str = "";
		if (data === "") {
			throw new Error("data is null");
		}
		if (typeof data === "object") {
			data_str = JSON.stringify(data, null, 4);
		} else {
			data_str = data;
		}

		await fs.promises.writeFile(path, data_str);
	}

	/*
	capture links from a string. input is string return a list of links.
	using regexp to capture links. what is link chatpter?
	*/
	static captureLink(content: string): string[] {
		let links: string[] = [];
		const regexp = /(https?:\/\/[^\s"<>|]+)/g;
		const captures = [...content.matchAll(regexp)];
		links = captures.map((capture) => capture[1]);
		return links;
	}
}

export async function fetchJson(url: URL): Promise<Response> {
	const response = await fetch(url);
	const json = await response.json();
	return json;
}
