const path = require('path');
const fs = require('fs');
const HackerNews = require('./componet/HackerNews');

let json_path = path.resolve(__dirname, './info.json');

let HN = new HackerNews(json_path);
HN.get_aids();
HN.get_comment();