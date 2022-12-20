import path from "path";
import { HackerNews } from "./componet/HackerNews";

let md_path = path.join(__dirname, "../Hacker-News/");
let readme_path = path.join(__dirname, "../README.md");
let jsonpath = path.join(__dirname, "./data/data.json");

let HN = new HackerNews();
(async () => {
	try {
		HN.json_data = await HN.initCollect();
		HN.json_data = await HN.getComment();
		let jsonData = await HN.getSourceLinks();
		await HN.writeJson(jsonData);
		await HN.updateReadme(readme_path, md_path);
	} catch (err) {
		throw err;
	}
})();
