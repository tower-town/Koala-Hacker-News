import { Utils } from "../src/componet/utils";

let url = "http://example.com" as unknown as URL;
let params = {
	user: "root",
	email: "example@hostname.com",
};
let link = Utils.parseUrl(url, params);

let expect_link: URL =
	"http://example.com?user=root&email=example@hostname.com" as unknown as URL;

test("test parse_url", () => {
	expect(expect_link).toEqual(link);
});
