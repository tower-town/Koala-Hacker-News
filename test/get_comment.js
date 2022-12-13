const fs = require("fs");
const path = require("path");
const HackerNews = require("../src/componet/HackerNews");

let HN = new HackerNews();
HN.get_comment();
