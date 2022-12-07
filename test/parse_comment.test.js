const HackerNews = require('../src/componet/HackerNews')

const HN = new HackerNews();

test("test message", () => {

    let message = {
        "bvid": "1",
        "list": [
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
    };


    let expect_message = [
        {
            "name": "",
            "link": "",
            "intro": ""
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
            "link": "",
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
            "intro": "",
        }
    ]
    let result = HN.parse_comment(message);
    expect(result).toEqual(result);
})

test ("test note", () => {
    let message = {
        "bvid": "BV1sY411T7QL",
        "list": [
            "01:78 one | 1",
            "http://a.com"
        ]
    };

    let expect_reslut = [
            {
                "name": "FRESH",
                "intro": "Deno 原生 SSR Web 框架",
                "link": "https://fresh.deno.dev/"
            },
            {
                "name": "Vitest",
                "intro": "基于 vite 的单元测试框架",
                "link": "https://cn.vitest.dev/"
            },
            {
                "name": "Rulex",
                "intro": "新的正则表达式语言",
                "link": "https://pomsky-lang.org/"
            },
            {
                "name": "Recut",
                "intro": "视频剪辑工具",
                "link": "https://getrecut.com/"
            },
            {
                "name": "moon",
                "intro": "构建工具",
                "link": "https://moonrepo.dev/"
            },
            {
                "name": "",
                "intro": "一个寻找项目灵感的网站",
                "link": "https://mysideproject.rocks/"
            },
            {
                "name": "",
                "intro": "程序员社交新尝试",
                "link": "https://connectdome.com/"
            }
        ];


    let result = HN.parse_comment(message);
    expect(result).toEqual(expect_reslut);
})