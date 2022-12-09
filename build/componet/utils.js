"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const fs = __importStar(require("fs"));
const sort_1 = require("./sort");
class Utils {
    constructor() { }
    sort_json(json_data, keyword) {
        let pubdates_dict = {};
        let sort_data = {};
        for (let key in json_data) {
            let index = json_data[key][keyword];
            pubdates_dict[index.toString()] = key;
        }
        let pubdates = Object.keys(pubdates_dict);
        let right_index = pubdates.length - 1;
        let sort = new sort_1.Sort(false);
        sort.quicksort(pubdates, 0, right_index);
        pubdates.forEach((pubdate, _) => {
            let key = pubdates_dict[pubdate];
            sort_data[key] = json_data[key];
        });
        return sort_data;
    }
    parse_url(url, params) {
        let params_keys = Object.keys(params);
        params_keys.forEach((value, index) => {
            params_keys[index] = `${value}=${params[value]}`;
        });
        let url_params = `${url}?${params_keys.join("&")}`;
        return url_params;
    }
    read_file(path) {
        let data = "{}";
        try {
            data = fs.readFileSync(path, "utf-8");
        }
        catch (err) {
            throw new Error(`no such file: ${path}\n${err}`);
        }
        return data;
    }
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    write_file(path, data) {
        let file_data = "";
        if (typeof data === "object") {
            file_data = JSON.stringify(data, null, 4);
        }
        else {
            file_data = data;
        }
        if (!file_data) {
            file_data = "{}";
        }
        fs.writeFile(path, (data = file_data), (error) => {
            if (error) {
                throw new Error(`${path}\n${error}`);
            }
        });
    }
}
exports.Utils = Utils;
