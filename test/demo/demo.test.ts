import fs from "fs";
import path from "path";
import util from "util";

function asyncReadFile(filePath: fs.PathLike): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			if (err) return reject(err);
			resolve(data);
		});
	});
}

function asyncWriteFile(filePath: fs.PathLike, data: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.writeFile(filePath, data, "utf-8", (err) => {
			if (err) return reject(err);
		});
	});
}

let json = async () => {
	try {
		let jsonPath = path.join(__dirname, "./demo.json");
		let data = await asyncReadFile(jsonPath);
		let jsondata = JSON.parse(data.toString());

		let newJsonPath = path.join(__dirname, "./test_data.json");
		let newJsonData = JSON.stringify(jsondata[0], null, 4);

		await asyncWriteFile(newJsonPath, newJsonData);
	} catch (err) {
		throw err;
	}
};

class Info {
	json?: any;
	constructor() {}
	getJson(json: any) {
		this.json = json;
	}
}

let info = new Info();
let jsonInfo = async () => {
	// json();
	try {
		let jsonPath = path.join(__dirname, "./demo.json");
		let stat = util.promisify(fs.readFile);
		let buf = await stat(jsonPath);
		let json = JSON.parse(buf.toString());
		// info.getJson(json);
		return info;
	} catch (err) {
		throw err;
	}
};

test("promise data", async () => {
	try {
		let infodata = await jsonInfo();
		// console.log(infodata.json);
	} catch (err) {
		throw err;
	}
});

async function fetchInOrder(
	urls: URL[],
): Promise<Promise<Record<string, any>[]>> {
	const jsonPromises = urls.map(async (url) => {
		const response = await fetch(url);
		return response.json();
	});

	return jsonPromises;
}

test("fetch function", async () => {
	let bvid = "BV1oP4y197dF";
	let urls = new URL(
		`http://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
	);
	let jsonPromises = await fetchInOrder([urls]);
	// console.log(await jsonPromises[0]);
	for (const jsonPromise of jsonPromises) {
		let data = await jsonPromise;
		// console.log(data["data"]["desc_v2"]);
	}
});
