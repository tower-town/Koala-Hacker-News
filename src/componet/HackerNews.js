const http = require("http");
const fs = require('fs');
const path = require('path');

class HackerNews {
    constructor(){
        this.aid = '';
        this.bvid = '';
        this.publish = '';
        this.info = '';
    }
    fetchJson(url, params, json_path){
		
        let params_keys = Object.keys(params);

        params_keys.forEach((value, index) => {
            params_keys[index] = `${value}=${params[value]}`;
        });

        url = `${url}?${params_keys.join('&')}`;

        http.get(url, (resp) => {
            let data = "";
            let video_info = {};
            resp.on("data", (chunk) => {
                data += chunk;
            });
            resp.on("end", () => {
                let video_data = JSON.parse(data)['data'];
                let fetch_keys = Object.keys(video_data);
                fetch_keys.forEach(element => {
                    if (element === 'archives'){
                        video_data[element].forEach((value, _) => {
                            let aid = value['aid'].toString();
                            video_info[aid] = {
                                "title": value['title'],
                                'aid': value['aid'],
                                'bvid': value['bvid'],
                                'pubdate': value['pubdate']
                            }
                        })
                    }
                    else if (element === 'top'){
                        let aid = params['oid'].toString();
                        content = video_data[element]['content'];
                        video_info[aid] = {
                            "aid": Number(aid),
                            "data": {
                                "name": "",
                                "intro": "",
                                "link": ""
                            }
                        }
                    }
                });
                let video_file = JSON.stringify(video_info, null, "\t");
                fs.writeFile(json_path, data=video_file, (error) => {
                    if (error)
                    {
                        console.log(`error is ${error.message}`);
                    }
                })
            });
        }).on('error', (error) => console.log(error.message));

    }
    generate_md(json_data, md_path) {
        let data_keys = Object.keys(json_data);
        let table_tr = '';
        data_keys.forEach((value, index) => {
            let data = json_data[value]['data'];
            data.forEach((item, _) => {
                table_tr += `
                <tr>
                    <td>${item['name']}</td>
                    <td>${item['intr']}</td>
                    <td>${item['link']}</td>
                </tr>
            `;
            }) 
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