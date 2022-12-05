
const HackerNews = require('../src/componet/HackerNews');
const fs = require('fs');
const path = require('path');


let json_path = path.resolve(__dirname, '../src/info.json');
let md_path = path.join(__dirname, '../Hacker-News/');
let readme_path = path.join(__dirname, './README.md');

let HN = new HackerNews(json_path);
HN.update_readme(readme_path, md_path);