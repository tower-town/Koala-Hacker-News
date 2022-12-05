const path = require('path');
const fs = require('fs');
const HackerNews = require('./componet/HackerNews');

let md_path = path.join(__dirname, '../Hacker-News/');
let readme_path = path.join(__dirname, '../README.md');

let HN = new HackerNews();
HN.get_aids();
HN.get_comment();
HN.update_readme(readme_path, md_path);