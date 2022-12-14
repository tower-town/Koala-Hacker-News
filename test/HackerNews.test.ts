import { HackerNews } from "../src/componet/HackerNews";
import path from "path";
import async from "async";

const HN = new HackerNews();

async function asyncInit() {
	try {
		HN.data_path = path.join(__dirname, "./data/data.json");
		let data_str = await HN.utils.readFile(HN.data_path);
		HN.json_data = await JSON.parse(data_str);
		HN.bvids = Object.keys(HN.json_data!);
	} catch {
		console.trace("Error");
	}
}

test("test HackerNews", () => {
	asyncInit();
	HN.getCollectInfo();
	asyncInit();

	HN.getComment();
	asyncInit();

	let json_data = HN.json_data;

	let expectJsonPath = path.join(__dirname, "../src/data/data.json");
	let expectJsonData = JSON.parse(HN.utils.readFile(expectJsonPath));

	expect(json_data).toStrictEqual(expectJsonData);
});
