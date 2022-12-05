const HackerNews = require('../src/componet/HackerNews')

const HN = new HackerNews();
let message = [
    '2:10 one is 1',
    "3:04 ,two is 2",
    "03:12 three | is 3",
    "04.56 four , is 4",
    "o5:00 five | 5",
    "06:66 six ? 6",
    "bgm is music",
    "http:/a.com",
    "http://b,com",
    "https:/c.c0m",
    "www.d.com",
    "http://e.com",
    "https//f.com",
]
let result = HN.parse_comment(message);

test("test message", () => {

    let expect_message = [
        {
            "name": "",
            "link": "",
            "into": ""
        },
        {
            "name": "",
            "link": "http://b,c0m",
            "intro": "two is 2"
        },
        {
            "name": "three",
            "link": "https://c.c0m",
            "intro": "is 3"
        },
        {
            "name": "",
            "link": "www.d.com",
            "intro": ""
        },
        {
            "name": "five",
            "link": "http://e.com",
            "intro": "5"
        },
        {
            "name": "",
            "link": "",
            "into": "",
        }
    ]
    expect(expect_message).toEqual(expect_message);
})
