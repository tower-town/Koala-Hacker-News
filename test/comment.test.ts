import { Api } from "../src/componet/api";
import { Comment } from "../src/componet/comment";
import { JsonData } from "../src/types/type";

const api = new Api();
const apiData = api.data;
const comment = new Comment(apiData);

test("test checkCommitData", () => {
	let json_data: JsonData = {
		three: {
			aid: 3,
			bvid: "three",
			title: "this is three",
			pubdate: 3,
		},
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

	let { newAids, newBvids } = comment.checkCommitData(json_data);
	let aids = ["3", "2", "1"];
	let bvids = ["three", "two", "one"];
	expect([newAids, newBvids]).toStrictEqual([aids, bvids]);
});

test("test message", () => {
	let message = {
		bvid: "1",
		list: [
			"02:10 one is 1",
			"03:04 ,two is 2",
			"03:12 three | 3 |is 3",
			"04:56 four 4 , is 4",
			"05:00 five | 5",
			"06:66 six ? 6",
			"bgm is music",
			"http://1.com",
			"http://2.com",
			"https://3.c0m",
			"https://4.com",
			"http://5.com",
			"https://6.com",
		],
	};

	let expect_message = [
		{
			name: "",
			link: "http://1.com",
			intro: "one is 1",
		},
		{
			name: "",
			link: "http://2.com",
			intro: "two is 2",
		},
		{
			name: "three",
			link: "https://3.c0m",
			intro: "3 |is 3",
		},
		{
			name: "four 4",
			link: "https://4.com",
			intro: "is 4",
		},
		{
			name: "five",
			link: "http://5.com",
			intro: "5",
		},
		{
			name: "",
			link: "https://6.com",
			intro: "six ? 6",
		},
	];
	let result = comment.parseComment(message);
	expect(result).toEqual(expect_message);
});

test("test note", () => {
	let message = {
		bvid: "BV1sY411T7QL",
		list: ["01:78 one | 1", "http://a.com"],
	};

	let expect_reslut = [
		{
			name: "FRESH",
			intro: "Deno 原生 SSR Web 框架",
			link: "https://fresh.deno.dev/",
		},
		{
			name: "Vitest",
			intro: "基于 vite 的单元测试框架",
			link: "https://cn.vitest.dev/",
		},
		{
			name: "Rulex",
			intro: "新的正则表达式语言",
			link: "https://pomsky-lang.org/",
		},
		{
			name: "Recut",
			intro: "视频剪辑工具",
			link: "https://getrecut.com/",
		},
		{
			name: "moon",
			intro: "构建工具",
			link: "https://moonrepo.dev/",
		},
		{
			name: "",
			intro: "一个寻找项目灵感的网站",
			link: "https://mysideproject.rocks/",
		},
		{
			name: "",
			intro: "程序员社交新尝试",
			link: "https://connectdome.com/",
		},
	];

	let result = comment.parseComment(message);
	expect(result).toEqual(expect_reslut);
});
