const path = require('path');
const fs = require('fs');
const HackerNews = require('./componet/HackerNews');

url_json = path.resolve(__dirname, './url.json');
fs.readFile(url_json, 'utf-8', (error, _data) => {
    if (!error) {
        json_data = JSON.parse(_data)['get_aids'];
        let url = json_data['url'];
        let params = json_data['params'];
        let json_path = path.resolve(__dirname, './info.json');
        info = new HackerNews;
        info.fetchJson(url, params, json_path);
    }
})
