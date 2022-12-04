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
        this.aids = Object.keys(this.json_data)
        
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

    write_file(data) {

        let file_data = JSON.stringify(data, null, "\t");
        if (!file_data) {
            file_data = '{}';
        }
        fs.writeFile(this.data_path, data = file_data, (error) => {
            if (error) {
                console.log(`error is ${error.message}`);
            }
        });
    }

    get_aids(){
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
                    let aid = value['aid'].toString();
                    video_info[aid] = {
                        "title": value['title'],
                        'aid': value['aid'],
                        'bvid': value['bvid'],
                        'pubdate': value['pubdate']
                    }
                })
                that.write_file(video_info);
            })
        })
    }

    get_comment() {

        let aids = this.aids;
        let comment_data = this.api_data['get_comment'];
        let comment_params = comment_data['params'];
        let that = this;

        let urls = [];
        aids.forEach((aid, index) => {
            comment_params['oid'] = aid;
            let url = this.parse_url(comment_data['url'], comment_params);
            urls.push(url);
        })

        async.mapLimit(urls, 5, async function (url) {
            const response = await fetch(url)
            return response.json()
        }, (err, results) => {
            if (err) { throw err }
            // results is now an array of the response bodies
            let video_info = that.json_data;
            results.forEach((value, index) => {
                let aid = aids[index].toString();
                let data = value['data'];
                let message = that.get_top_commment(data);
                let intro_data = that.parse_comment(message);
                video_info[aid]['data'] = intro_data;

                that.write_file(video_info);
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

        let message_data = message.filter(value => /^[0-9a-z].*/.test(value));
        let intro_data = [{
                'name': '',
                'intro': '',
                'link': ''
        }];

        let intro_name = [];
        let intro_link = [];
        let intro_content = [];
        message_data.forEach((value, index) => {
            value.trim();
            let name = '';
            let content = '';
            let intro_info = [];
            if (/^https?:\/\/\S+/.test(value)) {
                intro_link.push(value);
            }
            else {
                if (/[\|｜，,]/.test(value)) {
                    const regexp = /\d{2}:\d{2}(?:\s+)?([^｜|，,]+)?(?:[｜\|，,])([^｜|,，].*$)/g
                    intro_info = [...value.matchAll(regexp)][0];
                    if (intro_info) {
                        name = (intro_info[1] === undefined) ? '' : intro_info[1].trim();
                        content = intro_info[2].trim();
                    }
                    else {
                        console.log(value);
                    }
                }
                else {
                    const regexp = /\d{2}:\d{2}(?:\s+)?(.*$)/g;
                    intro_info = [...value.matchAll(regexp)][0];
                    content = intro_info[1].trim();
                }
                intro_name.push(name);
                intro_content.push(content);
            }
        });
        intro_name.forEach((value, index) => {
            if (!intro_link[index]){
                intro_link[index] = '';
            }
            intro_data[index] = {
                "name": value,
                "intro": intro_content[index],
                "link": intro_link[index]
            }
        })
        return intro_data;
    }

    generate_md(md_path) {
        let data_keys = Object.keys(this.json_data);
        let table_tr = '';
        data_keys.forEach((value, index) => {
            let data = this.json_data[value]['data'];

            if (data) {
                data.forEach((item, _) => {
                    table_tr += `
                <tr>
                    <td>${item['name']}</td>
                    <td>${item['intro']}</td>
                    <td>${item['link']}</td>
                </tr>
            `;
                })
            }
        })

        let table_hander = `
            <theader>
                <th>项目名称</th>
                <th>简介</th>
                <th>链接</th>
            </theader>
        `;

        let table_body = `
            <tbody>
                ${table_tr}
            </tbody>
        `;
        let table = `
            <table>
                ${table_hander}
                ${table_body}
            </table>
        `;
        console.log(table);
    }
};

module.exports = HackerNews;