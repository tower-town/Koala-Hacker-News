import { Utils } from "../src/componet/utils";

let url = "http://example.com" as unknown as URL;
let params = new URLSearchParams({
	user: "root",
	id: "2",
});
let link = Utils.parseUrl(url, params);

let expect_link: URL = new URL("http://example.com?user=root&id=2");

test("test parse_url", () => {
	expect(expect_link.toString()).toEqual(link.toString());
});
