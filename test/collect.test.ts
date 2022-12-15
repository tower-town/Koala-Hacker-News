import { Collect } from "../src/componet/collect";
import { Api } from "../src/componet/api";
import { JsonData, BvidData } from "../src/types/type";

const collect = new Collect();

let data: BvidData = {
	title: "this is one",
	aid: 1,
	bvid: "one",
	pubdate: 1,
};

let jsonData: JsonData = {
	two: {
		aid: 2,
		bvid: "two",
		title: "this is two",
		pubdate: 2,
	},
};

let newJsonData: JsonData = {
	two: {
		aid: 2,
		bvid: "two",
		title: "this is two",
		pubdate: 2,
	},
	one: {
		aid: 1,
		bvid: "one",
		title: "this is one",
		pubdate: 1,
	},
};

test("test checkCollect", () => {
	collect.checkCollect(jsonData, data);
	expect(jsonData).toStrictEqual(newJsonData);
});
