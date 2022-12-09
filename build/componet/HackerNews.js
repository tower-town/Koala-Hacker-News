"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HackerNews = void 0;
const path = __importStar(require("path"));
const async = __importStar(require("async"));
const utils_1 = require("./utils");
class HackerNews {
    constructor() {
        this.utils = new utils_1.Utils();
        this.params = {};
        this.utils = new utils_1.Utils();
        this.init();
    }
    init() {
        this.data_path = path.join(__dirname, "../data/data.json");
        this.json_data = JSON.parse(this.utils.read_file(this.data_path));
        this.bvids = Object.keys(this.json_data);
        this.api_path = path.join(__dirname, "../data/bilibili-api.json");
        this.api_data = JSON.parse(this.utils.read_file(this.api_path));
    }
    get_aids() {
        let api_data = this.api_data?.["get_aids"];
        this.url = api_data["url"];
        this.params = api_data["params"];
        let that = this;
        let urls = [];
        urls.push(this.utils.parse_url(this.url, this.params));
        async.mapLimit(urls, 5, async function (url) {
            const response = await fetch(url);
            return response.json();
        }, (err, results) => {
            if (err) {
                throw err;
            }
            let video_info = this.json_data;
            results?.forEach((data, index) => {
                let ids_data = data["data"];
                ids_data?.["archives"].forEach(
                // rome-ignore lint/suspicious/noExplicitAny: <explanation>
                (value, _) => {
                    let bvid = value["bvid"];
                    video_info[bvid] = {
                        title: value["title"],
                        aid: value["aid"],
                        bvid: value["bvid"],
                        pubdate: value["pubdate"],
                    };
                });
                let sort_data = this.utils.sort_json(video_info, "pubdate");
                that.utils.write_file(this.data_path, sort_data);
            });
        });
    }
    get_comment() {
        let comment_data = this.api_data?.["get_comment"];
        let comment_params = comment_data["params"];
        let that = this;
        if (!this.bvids) {
            this.get_aids();
            this.init();
        }
        let aids = {};
        this.bvids?.forEach((value, _) => {
            let aid = this.json_data?.[value]?.["aid"];
            aids[aid.toString()] = value;
        });
        let urls = [];
        let aids_key = Object.keys(aids);
        aids_key.forEach((value, _) => {
            comment_params["oid"] = value;
            let url = this.utils.parse_url(comment_data["url"], comment_params);
            urls.push(url);
        });
        async.mapLimit(urls, 5, async function (url) {
            const response = await fetch(url);
            return response.json();
        }, (err, results) => {
            if (err) {
                throw err;
            }
            // results is now an array of the response bodies
            let video_info = that.json_data;
            results?.forEach((value, index) => {
                let aid_key = aids_key[index];
                let bvid = aids[aid_key];
                let data = value["data"];
                let message = that.get_top_commment(data, bvid);
                let intro_data = that.parse_comment(message);
                video_info[bvid]["data"] = intro_data;
                let sort_data = this.utils.sort_json(video_info, "pubdate");
                that.utils.write_file(this.data_path, sort_data);
            });
        });
    }
    get_top_commment(
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    comment, bvid) {
        let top = {
            comment: comment["top"]["upper"],
            reply: comment["replies"][0],
        };
        let message = {
            content: "",
            comment: "",
            reply: "",
            dict: {
                bvid: bvid,
                list: [''],
            },
        };
        message['dict']['list'] = [];
        if (top["comment"] === null) {
            message["comment"] = "";
            if (top["reply"]["member"]["mid"] === "489667127") {
                message["reply"] = top["reply"]["content"]["message"];
            }
        }
        else {
            message["comment"] = top["comment"]["content"]["message"];
            if (top["comment"]["replies"] !== null) {
                message["reply"] = top["comment"]["replies"][0]["content"]["message"];
            }
        }
        message["content"] = `${message["comment"]}\n${message["reply"]}`;
        message["content"].split("\n").forEach((value, _) => {
            message["dict"]["list"].push(value.trim());
        });
        return message["dict"];
    }
    parse_comment(message) {
        let message_data = message["list"].filter((value) => /^[0-9hw].*/.test(value));
        let note_path = path.join(__dirname, "../data/note.json");
        let note_data = JSON.parse(this.utils.read_file(note_path));
        for (let key in note_data) {
            if (message["bvid"] === key) {
                return note_data[key]["data"];
            }
        }
        let intro = {
            data: [
                {
                    name: "",
                    intro: "",
                    link: "",
                },
            ],
            name: [''],
            link: [''],
            content: [''],
        };
        intro['name'] = [];
        intro['link'] = [];
        intro['content'] = [];
        message_data.forEach((value, index) => {
            let name = "";
            let content = "";
            let info = [];
            if (/^https?:\/\/\S+/.test(value)) {
                intro["link"].push(value);
            }
            else {
                if (/[\|｜，,]/.test(value)) {
                    const regexp = /\d{2}:\d{2}(?:\s+)?([^｜|，,]+)?(?:[｜\|，,])([^｜|,，].*$)/g;
                    info = [...value.matchAll(regexp)][0];
                    if (info) {
                        name = info[1] === undefined ? "" : info[1];
                        content = info[2];
                    }
                    else {
                        console.log(`Error: escaple capture is ${value}`);
                    }
                }
                else {
                    const regexp = /\d{2}:\d{2}(?:\s+)?(.*$)/g;
                    info = [...value.matchAll(regexp)][0];
                    if (info) {
                        content = info[1];
                    }
                    else {
                        console.log(`Error: escaple capture is ${value}`);
                    }
                }
                intro["name"].push(name);
                intro["content"].push(content);
            }
        });
        intro["name"].forEach((value, index) => {
            if (!intro["link"][index]) {
                intro["link"][index] = "";
            }
            intro["data"][index] = {
                name: value.trim(),
                intro: intro["content"][index].trim(),
                link: intro["link"][index].trim(),
            };
        });
        return intro["data"];
    }
    generate_tables() {
        this.init();
        let data_keys = Object.keys(this.json_data);
        let tables = {
            content: [],
            tr: [],
            title: {
                content: [],
                link: [],
                pubdate: [],
            },
        };
        data_keys.forEach((value, index) => {
            let data = this.json_data?.[value];
            let title_item = data["title"];
            let title_link = `https://www.bilibili.com/video/${value}`;
            let title_pubdate = data["pubdate"].toString();
            tables["title"]["content"].push(title_item);
            tables["title"]["link"].push(title_link);
            tables["title"]["pubdate"].push(title_pubdate);
            if (data["data"]) {
                let tr_item = "";
                data["data"].forEach((item, _) => {
                    tr_item += `
                <tr>
                    <td>${item["name"]}</td>
                    <td>${item["intro"]}</td>
                    <td>${item["link"]}</td>
                </tr>
            `;
                });
                tables["tr"].push(tr_item);
            }
        });
        let table_hander = `
            <theader>
                <th>名称</th>
                <th>简介</th>
                <th>链接</th>
            </theader>
        `;
        tables["title"]["content"].forEach((item, index) => {
            let table_body = `
            <tbody>
                ${tables["tr"][index]}
            </tbody>
        `;
            let table = `
            [${item}](${tables["title"]["link"][index]})
            <table>
                ${table_hander}
                ${table_body}
            </table>
        `;
            const regexp = /\s+(\t+)?\r?\n/g;
            tables["content"].push(table.trim().replace(regexp, ""));
        });
        return tables;
    }
    generate_docs() {
        let tables = this.generate_tables();
        let content = tables["content"];
        let pubdates = tables["title"]["pubdate"];
        let docs = {};
        let pub_list = [];
        let state = "1";
        pubdates.sort((a, b) => {
            return Number(b) - Number(a);
        });
        pubdates.forEach((value, index) => {
            let date = new Date(Number(value) * 1000);
            let pub_date = `${date.getFullYear()}-${date.getMonth() + 1}`;
            if (state !== pub_date) {
                if (pub_list.length !== 0) {
                    docs[state] = pub_list;
                    pub_list = [];
                }
                state = pub_date;
            }
            if (value === pubdates[pubdates.length - 1]) {
                docs[pub_date] = pub_list;
            }
            pub_list.push(content[index]);
        });
        return docs;
    }
    generate_md(md_path) {
        let docs = this.generate_docs();
        let file = {
            name: "",
            content: "",
            path: "",
        };
        let docs_keys = Object.keys(docs);
        let paths = [];
        docs_keys.forEach((key, _) => {
            file["name"] = `${key}-Hacker-News.md`;
            file["content"] = docs[key].join("\n");
            file["path"] = path.join(md_path, file["name"]);
            if (docs[key].length === 0) {
                console.log(docs[key]);
            }
            paths.push(file["path"]);
            this.utils.write_file(file["path"], file["content"]);
        });
        return {
            keys: docs_keys,
            path: paths,
        };
    }
    update_readme(readme_path, md_path) {
        let docs = this.generate_md(md_path);
        let title = "# Koala Hacker News\n b 站 up 主 [Koala 聊开源](https://space.bilibili.com/489667127) 的《Hacker News 周报》[合集](https://space.bilibili.com/489667127/channel/collectiondetail?sid=249279) 的内容总结\n";
        let contents = "\n## 目录\n\n";
        let chapters = "";
        docs.keys.forEach((value, index) => {
            let doc_path = docs["path"][index];
            let re_path = path.relative(path.dirname(readme_path), doc_path);
            let new_path = re_path.replaceAll("\\", "/");
            chapters += `- [${value}: [Hacker News 周报]](${new_path})\n`;
        });
        let file_end = "\n## 参考\n\n - [bilibili-api-collect](https://github.com/SocialSisterYi/bilibili-API-collect)";
        let readme = `${title}${contents}${chapters}${file_end}`;
        this.utils.write_file(readme_path, readme);
    }
}
exports.HackerNews = HackerNews;
