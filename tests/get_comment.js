const fs = require('fs');
const path = require('path');
const HackerNews = require('../src/componet/HackerNews')


let data_path = path.join(__dirname, '../src/info.json');


let HN = new HackerNews(data_path);
HN.get_comment();