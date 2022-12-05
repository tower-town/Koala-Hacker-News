const HackerNews = require('../src/componet/HackerNews');
const fs = require('fs');
const path = require('path');

let md_path = path.join(__dirname, '../Hacker-News/');

let HN = new HackerNews();
HN.generate_md(md_path);