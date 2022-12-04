const http = require("http");
const fs = require('fs');
const path = require('path');

class HackerNews {
    constructor(data_path) {
        this.params = {};
        this.url = '';

        this.data_path = data_path;
        this.json_data = JSON.parse(this.read_file(data_path));
        this.aids = Object.keys(this.json_data)
        
        this.api_path = path.join(__dirname, '../bilibili-api.json');
        this.api_data = JSON.parse(this.read_file(this.api_path))
    }
    fetchJson() {

        let params_keys = Object.keys(this.params);

        params_keys.forEach((value, index) => {
            params_keys[index] = `${value}=${this.params[value]}`;
        });

        let url = `${this.url}?${params_keys.join('&')}`;

        let video_info = this.json_data;

        http.get(url, (resp) => {
            let data = "";
            resp.on("data", (chunk) => {
                data += chunk;
            });
            resp.on("end", () => {
                let video_data = JSON.parse(data)['data'];
                for (let key in video_data) {
                    if (key === 'archives') {
                        video_data[key].forEach((value, _) => {
                            let aid = value['aid'].toString();
                            video_info[aid] = {
                                "title": value['title'],
                                'aid': value['aid'],
                                'bvid': value['bvid'],
                                'pubdate': value['pubdate']
                            }
                        })
                    }
                    else if (key === 'top') {
                        let aid = this.params['oid'].toString();
                        let message = this.get_top_commment(video_data);
                        let intro_data = this.parse_comment(message);
                        video_info[aid]['data'] = intro_data;
                    }
                    this.write_file(video_info);
                }
        }).on('error', (error) => console.log(error.message));

        })
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
        this.fetchJson();
    }

    get_comment(){
        let api_data = this.api_data['get_comment'];
        this.url = api_data['url'];
        this.params = api_data['params'];
        this.aids.forEach((aid, _) => {

            this.params['oid'] = aid;
            this.fetchJson();
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
                if (/\||｜/.test(value)) {
                    const regexp = /\d{2}:\d{2}(?:\s+)?([^｜|]+)?(?:｜|\|)([^｜|].*$)/g;
                    intro_info = [...value.matchAll(regexp)][0];
                    name = (intro_info[1] === undefined) ? '' : intro_info[1].trim();
                    content = intro_info[2].trim();
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