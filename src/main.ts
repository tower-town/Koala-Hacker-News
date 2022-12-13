import * as path from "path";
import { HackerNews } from "./componet/HackerNews";

let md_path = path.join(__dirname, "../Hacker-News/");
let readme_path = path.join(__dirname, "../README.md");

let HN = new HackerNews();
HN.getCollectInfo();
HN.getComment();
HN.updateReadme(readme_path, md_path);
HN.getSourceLinks();
