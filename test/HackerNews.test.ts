import { HackerNews } from "../src/componet/HackerNews";
import path from "path";

const jsonpath = path.join(__dirname, "./data/data.json");
const HN = new HackerNews({ jsonPath: jsonpath });

test("test async initCollect", async () => {
	try {
		let newJsonData = await HN.initCollect();
		await HN.writeJson(newJsonData, jsonpath);
	} catch (err) {
		throw err;
	}
});

test("test async getSourceLink", async () => {
	try {
		let jsonData = await HN.getSourceLinks();
		await HN.writeJson(jsonData, jsonpath);
	} catch (err) {
		throw err;
	}
});

test("test async getComment", async () => {
	try {
		let jsonData = await HN.getComment();
		await HN.writeJson(jsonData, jsonpath);
	} catch (err) {
		throw err;
	}
});

test("test HackerNews", async () => {
	HN.json_data = await HN.initCollect();
	await HN.getComment();
	let jsonData = await HN.getSourceLinks();
	await HN.writeJson(jsonData, jsonpath);
});
