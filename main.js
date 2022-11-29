const http = require("http");
const fs = require('fs');
const path = require('path');

let aid = "85440373";
let url = `http://api.bilibili.com/x/web-interface/view?aid=${aid}`;

http.get(url, (resp) => {
	data = "";
	resp.on("data", (chunk) => {
		data += chunk;
	});
	resp.on("end", () => {
		video_data = JSON.parse(data)['data'];
        let video_info = {
            "aid": video_data['aid'],
            "bvid": video_data['bvid'],
            'title': video_data['title']
        };
		video_file = JSON.stringify(video_info, null, "\t");
        fs.writeFile('./info.json', data=video_file, 'utf-8', (error) => {
            if (error)
            {
                console.log(`error is ${error.message}`);
            }
        })
	});
});