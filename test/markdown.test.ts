import { JsonData } from "../src/types/type";
import { Markdown } from "../src/componet/markdown";
import * as path from "path";
import { HackerNews } from "../src/componet/HackerNews";
import fs from "fs";

let new_json_data: JsonData = {
	"1": {
		aid: 1,
		bvid: "1",
		pubdate: 1,
		title: "one",
		data: [
			{
				name: "1-1",
				intro: "one-1",
				link: "one-1.com",
			},
			{
				name: "1-2",
				intro: "one-2",
				link: "one-2.com",
			},
		],
	},
	"2": {
		aid: 2,
		bvid: "2",
		pubdate: 2,
		title: "two",
		data: [
			{
				name: "2-1",
				intro: "two-1",
				link: "two-1.com",
			},
			{
				name: "2-2",
				intro: "two-2",
				link: "two-2.com",
			},
		],
	},
};

let MD = new Markdown(new_json_data);

test("test generate_tables", () => {
	let tables_data = MD.generateTables();

	let tables_titles = {
		names: tables_data["title"]["content"],
		link: tables_data["title"]["link"],
		pubdate: tables_data["title"]["pubdate"],
	};

	let expect_titles = {
		names: ["one", "two"],
		link: [
			"https://www.bilibili.com/video/1",
			"https://www.bilibili.com/video/2",
		],
		pubdate: ["1", "2"],
	};

	expect(tables_titles).toStrictEqual(expect_titles);
});

test("test generate_docs", () => {
	let docs = MD.generateDocs();

	// ignore content indocs in expect_docs
	let expect_docs: { [pub_data: string]: string } = {};
	for (let key in new_json_data) {
		let date = new Date(Number(key) * 1000);
		let pub_date = `${date.getFullYear()}-${date.getMonth() + 1}`;
		expect_docs[pub_date] = "...";
	}
	let docs_keys = Object.keys(docs);
	let expect_docs_keys = Object.keys(expect_docs);

	expect(docs_keys).toStrictEqual(expect_docs_keys);
});

// notes: generate_md will write into files

test("test generate_md", () => {
	let md_path = path.join(__dirname, "./HackerNews/");
	let md_data = MD.generateMd(md_path);

	let expect_md_data = {
		pub_dates: ["1970-1"],
	};

	let recievePathsStat = md_data["paths"].map((mdPath) =>
		fs.existsSync(mdPath),
	);
	let expectPathsStat = [true];

	expect(recievePathsStat).toStrictEqual(expectPathsStat);
	expect(md_data["pub_dates"]).toStrictEqual(expect_md_data["pub_dates"]);
});

test("update readme.md", () => {
	let md_path = path.join(__dirname, "./HackerNews/");
	let readme_path = path.join(__dirname, "./README.md");

	let HN = new HackerNews();
	HN.markdown = MD;
	HN.updateReadme(readme_path, md_path);

	let mdDirList = fs.readdirSync(md_path, "utf-8");
	let expectDirList = ["1970-1-Hacker-News.md"];

	expect(mdDirList).toEqual(expectDirList);

	let pathsStat = fs.existsSync(readme_path);
	expect(pathsStat).toStrictEqual(true);
});
