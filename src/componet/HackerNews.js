const http = require("http");
const fs = require('fs');
const path = require('path');

class HackerNews {
    constructor(data_path) {
        this.params = {};
        this.url = '';
        this.data_path = data_path;
        this.json_data = JSON.parse(this.read_file(data_path));
        
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
                        let aid = params['oid'].toString();
                        let content = video_data[key]['upper']['content'];
                        let message = content['message'].split('\n');
                        let intro_data = this.parse_comment(message);
                        video_info[aid]['data'] = intro_data;
                    }
                }
                let video_file = JSON.stringify(video_info, null, "\t");
                fs.writeFile(this.data_path, data = video_file, (error) => {
                    if (error) {
                        console.log(`error is ${error.message}`);
                    }
                })
            });
        }).on('error', (error) => console.log(error.message));

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

    get_aids(){
        let api_data = this.api_data['get_aids'];
        this.url = api_data['url'];
        this.params = api_data['params'];
        this.fetchJson();
    }

    get_comment(aid){
        let api_data = this.api_data['get_comment'];
        this.url = api_data['url'];
        this.params = api_data['params'];
        this.params['oid'] = aid;
        this.fetchJson();

    }
    parse_comment(message) {

        let message_data = message.filter(value => /^[0-9a-z].*/.test(value));

        let intro_data = [];
        let intro_name = [];
        let link = [];
        let intro = [];
        message_data.forEach((value, index) => {
            value.trim();
            if (/^https?:\/\/\S+/.test(value)) {
                link.push(value);
            }
            else {
                const regexp = /\d{2}:\d{2}\s+([^｜|]+)(｜|\|)([^｜|].*)/g;
                let intro_info = [...value.matchAll(regexp)];
                intro_name.push(intro_info[0][1].trim());
                intro.push(intro_info[0][3].trim());
            }
        });
        intro_name.forEach((value, index) => {
            intro_data[index] = {
                "name": value,
                "intro": intro[index],
                "link": link[index]
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