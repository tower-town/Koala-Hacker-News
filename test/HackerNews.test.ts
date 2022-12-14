import { HackerNews } from "../src/componet/HackerNews";
import path from "path";
import { JsonData } from "../src/types/type";

const HN = new HackerNews();

function renewInit() {
	HN.data_path = path.join(__dirname, "../data/data.json");
	let data_str = HN.utils.readFile(HN.data_path);
	HN.json_data = JSON.parse(data_str);
	HN.bvids = Object.keys(HN.json_data!);
}

renewInit();
HN.getCollectInfo();
renewInit();
HN.getComment();
renewInit();
HN.getSourceLinks();
