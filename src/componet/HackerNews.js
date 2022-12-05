const http = require("http");
const fs = require('fs');
const path = require('path');
const async = require('async');

class HackerNews {
    constructor() {
        this.params = {};
        this.url = '';

        this.data_path = path.join(__dirname, '../info.json');
        this.json_data = JSON.parse(this.read_file(this.data_path));

        this.bvids = Object.keys(this.json_data);

        this.api_path = path.join(__dirname, '../bilibili-api.json');
        this.api_data = JSON.parse(this.read_file(this.api_path))
    }

    parse_url(url, params) {
        let urls = [];
        let params_keys = Object.keys(params);

        params_keys.forEach((value, index) => {
            params_keys[index] = `${value}=${params[value]}`;
        });
        urls = `${url}?${params_keys.join('&')}`;
        return urls;
    }

    read_file(path) {
        let data = '{}';
        try {
            data = fs.readFileSync(path, 'utf-8');
        } catch (err) {
            console.log(err);
        }
        return data;
    }

    write_file(path, data) {

        let file_data = '';

        if (typeof data === "object") {
            file_data = JSON.stringify(data, null, 4);
        }
        else {
            file_data = data;
        }

        if (!file_data) {
            file_data = '{}';
        }
        fs.writeFile(path, data = file_data, (error) => {
            if (error) {
                console.log(`error is ${error.message}`);
            }
        });
    }

    get_aids() {
        let api_data = this.api_data['get_aids'];
        this.url = api_data['url'];
        this.params = api_data['params'];
        let that = this;

        let urls = [];
        urls.push(this.parse_url(this.url, this.params));

        async.mapLimit(urls, 5, async function (url) {
            const response = await fetch(url)
            return response.json()
        }, (err, results) => {
            if (err) { throw err }

            let video_info = this.json_data;
            results.forEach((data, index) => {
                let ids_data = data['data'];
                ids_data['archives'].forEach((value, _) => {
                    let bvid = value['bvid'];
                    video_info[bvid] = {
                        "title": value['title'],
                        'aid': value['aid'],
                        'bvid': value['bvid'],
                        'pubdate': value['pubdate']
                    }
                })
                that.write_file(this.data_path, video_info);
            })
        })
    }

    get_comment() {

        let comment_data = this.api_data['get_comment'];
        let comment_params = comment_data['params'];
        let that = this;

        if (!this.bvids) {
            this.get_aids();
        }

        let aids = {};
        this.bvids.forEach((value, _) => {
            let aid = this.json_data[value]['aid'];
            aids[aid] = value;

        });

        let urls = [];
        let aids_key = Object.keys(aids);
        aids_key.forEach((value, _) => {
            comment_params['oid'] = value;
            let url = this.parse_url(comment_data['url'], comment_params);
            urls.push(url);
        });

        async.mapLimit(urls, 5, async function (url) {
            const response = await fetch(url)
            return response.json()
        }, (err, results) => {
            if (err) { throw err }
            // results is now an array of the response bodies
            let video_info = that.json_data;
            results.forEach((value, index) => {
                let aid_key = aids_key[index];
                let bvid = aids[aid_key];
                let data = value['data'];
                let message = that.get_top_commment(data);
                let intro_data = that.parse_comment(message);
                video_info[bvid]['data'] = intro_data;

                that.write_file(this.data_path, video_info);
            })
        })
    }

    get_top_commment(comment) {
        let top_comment = comment['top']['upper'];
        let top_reply = comment['replies'][0];
        let message = '';
        if (top_comment === null) {

            if (top_reply['member']['mid'] === '489667127') {
                message = top_reply['content']['message'];
            }
        }
        else {
            message = top_comment['content']['message'];
        }
        return message.split('\n');
    }

    parse_comment(message) {

        let message_data = message.filter(value => /^[0-9hw].*/.test(value));

        let intro = {
            "data": [{
                'name': '',
                'intro': '',
                'link': ''

            }],
            "name": [],
            "link": [],
            "content": []
        }
        message_data.forEach((value, index) => {
            value.trim();
            let name = '';
            let content = '';
            let info = [];
            if (/^https?:\/\/\S+/.test(value)) {
                intro['link'].push(value);
            }
            else {
                if (/[\|｜，,]/.test(value)) {
                    const regexp = /\d{2}:\d{2}(?:\s+)?([^｜|，,]+)?(?:[｜\|，,])([^｜|,，].*$)/g
                    info = [...value.matchAll(regexp)][0];
                    if (info) {
                        name = (info[1] === undefined) ? '' : info[1].trim();
                        content = info[2].trim();
                    }
                    else {
                        console.log(`Error: escaple capture is ${value}`);
                    }
                }
                else {
                    const regexp = /\d{2}:\d{2}(?:\s+)?(.*$)/g;
                    info = [...value.matchAll(regexp)][0];
                    if (info) {
                        content = info[1].trim();
                    }
                    else {
                        console.log(`Error: escaple capture is ${value}`);
                    }
                }
                intro['name'].push(name);
                intro['content'].push(content);
            }
        });
        intro['name'].forEach((value, index) => {
            if (!intro['link'][index]) {
                intro['link'][index] = '';
            }
            intro['data'][index] = {
                "name": value,
                "intro": intro['content'][index],
                "link": intro['link'][index]
            }
        })
        return intro['data'];
    }

    generate_tables() {
        let data_keys = Object.keys(this.json_data);
        let tables = {
            "content": [],
            "tr": [],
            "title":{
                "content": [],
                "link": [],
                "pubdate": []
            }
        }
        data_keys.forEach((value, index) => {
            let data = this.json_data[value];
            let title_item = data['title'];
            let title_link = `https://www.bilibili.com/video/${value}`
            let title_pubdate = data['pubdate'];
            tables['title']['content'].push(title_item);
            tables['title']['link'].push(title_link);
            tables['title']['pubdate'].push(title_pubdate);

            if (data['data']) {
                let tr_item = '';
                data['data'].forEach((item, _) => {
                    tr_item += `
                <tr>
                    <td>${item['name']}</td>
                    <td>${item['intro']}</td>
                    <td>${item['link']}</td>
                </tr>
            `;
                })
                tables['tr'].push(tr_item);
            }
        })

        let table_hander = `
            <theader>
                <th>名称</th>
                <th>简介</th>
                <th>链接</th>
            </theader>
        `;

        tables['title']['content'].forEach((item, index) => {

            let table_body = `
            <tbody>
                ${tables['tr'][index]}
            </tbody>
        `;
            let table = `
            [${item}](${tables['title']['link'][index]})
            <table>
                ${table_hander}
                ${table_body}
            </table>
        `;
            const regexp = /\s+(\t+)?\r?\n/g;
            tables['content'].push(table.trim().replaceAll(regexp, ''));
        })

        return tables;
    }

    generate_docs(){
        let tables = this.generate_tables();
        let content = tables['content'];
        let pubdates = tables['title']['pubdates'];

        let docs = {};
        let pub_list = [];

        let state = '1';
        pubdates.sort((a, b) => {return b - a});
        pubdates.forEach((value, index) => {
            let date = new Date(value*1000);
            let pub_date = `${date.getFullYear()}-${date.getMonth()+1}`;
            if (state !== pub_date){
                if (pub_list.length !== 0){
                    docs[state] = pub_list;
                    pub_list = [];
                }
                state = pub_date;
            }
            if (value === pubdates[pubdates.length - 1]) {
                docs[pub_date] = pub_list;
            }
            pub_list.push(content[index]);
        })
        
        return docs;
    }

    generate_md(md_path){

        let docs = this.generate_docs();
        let file = {
            "name": '',
            'content': '',
            'path': ''
        };

        let docs_keys = Object.keys(docs);
        let paths = [];
        docs_keys.forEach((key, _) => {
            file['name'] = `${key}-Hacker-News.md`;
            file['content'] = docs[key].join('\n');
            file['path'] = path.resolve(md_path, file['name']);

            if (docs[key].length === 0) {
                console.log(docs[key]);
            }
            paths.push(file['path']);
            this.write_file(file['path'], file['content']);
        })
        
        return {
            'keys': docs_keys,
            'path': paths
        }
    }

    update_readme(readme_path, md_path){
        let docs = this.generate_md(md_path);
        let title = '# Koala Hacker News\n b 站 up 主 [Koala 聊开源](https://space.bilibili.com/489667127) 的《Hacker News 周报》[合集](https://space.bilibili.com/489667127/channel/collectiondetail?sid=249279) 的内容总结\n';

        let contents = '\n## 目录\n\n';
        let chapters = '';
        docs.keys.forEach((value, index) => {

            let doc_path = docs['path'][index];
            let re_path = path.relative(path.basename(readme_path), doc_path);
            chapters += `- [${value}: [Hacker News 周报]](${re_path})\n`;
        })

        let file_end = '\n## 参考\n\n - [bilibili-api-collect](https://github.com/SocialSisterYi/bilibili-API-collect)';

        let readme = `${title}${contents}${chapters}${file_end}`;
        this.write_file(readme_path, readme);
    }
};

module.exports = HackerNews;