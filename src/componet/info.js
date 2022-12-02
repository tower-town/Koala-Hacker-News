const http = require("http");
const fs = require('fs');
const path = require('path');

class Info{
    constructor(){
        this.aid = str;
        this.bvid = str;
        this.publish = str;
    }
    fetchJson(url, params, fetch){
        /*
        url = {
            "get_aids": {
                "url": 'https://api.bilibili.com/x/polymer/space/seasons_archives_list',
                "params": {
                    'mid': '489667127',
                    'season_id': '249279',
                    'sort_reverse': 'false',
                    'page_num': str(page_num),
                    'page_size': '30'
                }
            },
            "get_commit": {
                "url": 'http://api.bilibili.com/x/v2/reply/main',
                "params": {
                    'type': 1,
                    'oid': aid
                }
            },
            "get_title": {
                "url": "http://api.bilibili.com/x/web-interface/view"
                "params": {
                    'aid': aid
                }
            }
            ""
        }
        */
		
        params_keys = params.keys();
        fetch_keys = fetch.keys();
        url = `${url}?${keys[0]}=${params[keys[0]]}`
        http.get(url, (resp) => {
            data = "";
            video_info = {};
            resp.on("data", (chunk) => {
                data += chunk;
            });
            resp.on("end", () => {
                video_data = JSON.parse(data)['data'];
                fetch_keys.forEach(element => {
                    video_info[element] = video_data[element]
                });
                video_file = JSON.stringify(video_info, null, "\t");
                json_path = path.resolve(__dirname, './info.json');
                fs.writeFile(json_path, data=video_file, 'utf-8', (error) => {
                    if (error)
                    {
                        console.log(`error is ${error.message}`);
                    }
                })
            });
        });

    }
}

module.exports = Info;
