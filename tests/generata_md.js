const HackerNews = require('./src/componet/HackerNews');
const fs = require('fs');
const path = require('path');


let json_path = path.resolve(__dirname, '../src/info.json');
let md_path = path.join(__dirname, './README.md')

fs.readFile(json_path, 'utf-8', (error, data) => {
    if (!error){
        let HN = new HackerNews();
        HN.generate_md(data, md_path);
    }
})