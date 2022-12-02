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
                            video_info[value['bvid']] = {
                                "title": value['title'],
                                'aid': value['aid'],
                                'bvid': value['bvid'],
                                'pubdate': value['pubdate']
                            }
                        })
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
};

module.exports = HackerNews;