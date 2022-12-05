
const HackerNews = require('../src/componet/HackerNews')

const HN = new HackerNews();
let url = 'http://example.com'
let params = {
    "user": "root",
    "email": "example@hostname.com"
}
let link = HN.parse_url(url, params);

let expect_link = "http://example.com?user=root&email=example@hostname.com";

test("test parse_url", () => {
    expect(expect_link).toEqual(link);
})