import { Utils } from "../src/componet/utils";

let url = "http://example.com" as unknown as URL;
let params = new URLSearchParams({
	user: "root",
	email: "example@hostname.com",
});
let link = Utils.parseUrl(url, params);

let expect_link: URL = new URL(
	"http://example.com?user=root&email=example@hostname.com",
);

test("test parse_url", () => {
	expect(expect_link.origin).toEqual(link.origin);
});
