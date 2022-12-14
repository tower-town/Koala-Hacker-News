import { SourceLink } from "../src/componet/source_link";
import { Api } from "../src/componet/api";
import { JsonData } from "../src/types/type";

let new_json_data: JsonData = {
	"1": {
		aid: 1,
		bvid: "1",
		pubdate: 1,
		title: "one",
		source: ["test-one.net"],
	},
	"2": {
		aid: 2,
		bvid: "2",
		pubdate: 2,
		title: "two",
	},
};

const api = new Api();
const apiData = api.data;
const source_link = new SourceLink(apiData);

test("test check_source_link", () => {
	let check = source_link.checkSourceLink(new_json_data);
	expect(check).toEqual(["2"]);
});

test("test capture link", () => {
	let link_str = "this is a link: http://test-link.com";
	let capture = source_link.captureLink(link_str);
	expect(capture[0]).toBe("http://test-link.com");
});
