const path = require('path');
const fs = require('fs');
const HackerNews = require('../src/componet/HackerNews');

let json_path = path.join(__dirname, '../src/info.json');

let HN = new HackerNews(json_path);
HN.get_aids();