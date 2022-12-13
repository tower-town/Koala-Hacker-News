import { HackerNews } from "../src/componet/HackerNews";

let HN = new HackerNews();
HN.json_data = {
	bv1: {
		title: "test-1",
		aid: 1,
		bvid: "bv1",
		pubdate: 2022,
	},
	bv2: {
		title: "test-2",
		aid: 2,
		bvid: "bv2",
		pubdate: 2022,
	},
};

HN.bvids = Object.keys(HN.json_data);

test("test get aid", () => {
	let ReceiveAids = HN.getAids();
	let expectAids = ["1", "2"];
	expect(ReceiveAids).toStrictEqual(expectAids);
});
