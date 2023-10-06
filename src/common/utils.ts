import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import { Response } from "./type";

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

	static async readDir(path: fs.PathLike): Promise<string[]> {
		try {
			const files = await fs.promises.readdir(path);
			return files;
		} catch (error) {
			throw new Error(`no such file: ${path}\n${error}`);
		}
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
	try {
		// referer: https://github.com/SocialSisterYi/bilibili-API-collect/issues/686

		let headers = {}
		if (url.host === 'api.bilibili.com') {
			headers = {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.43",
				// Cookies: "buvid3=DAEEB42F-CD0A-BF05-7072-F07D0BE6865E82525infoc;"
				Cookies: `buvid3=${uuidv4()}infoc;`
			}
		}
		const response = await fetch(url, { headers });
		const json = await response.json();
		if (json.code !== 0) {
			throw new Error(`fetch error: ${json.message}, code is ${json.code}`);
		}
		return json;
	} catch (error) {
		throw new Error(`fetch error: ${error}`);
	}
}
