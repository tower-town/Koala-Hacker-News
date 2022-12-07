class Utils{
    constructor(){

    }
    sort_json(json_data, keyword){
        let pubdates_dict = {};
        let sort_data = {}

        for (let key in json_data){
            pubdates_dict[json_data[key][keyword]] = key;
        }

        let pubdates = Object.keys(pubdates_dict);
        let right_index = pubdates.length - 1;
        let sort = new Sort(0);
        sort.quicksort(pubdates, 0, right_index);

        pubdates.forEach((pubdate, _) => {
            let key = pubdates_dict[pubdate];
            sort_data[key] = json_data[key];
        })

        return sort_data;
    }

    parse_url(url, params) {
        let urls = [];
        let params_keys = Object.keys(params);

        params_keys.forEach((value, index) => {
            params_keys[index] = `${value}=${params[value]}`;
        });
        urls = `${url}?${params_keys.join('&')}`;
        return urls;
    }

    read_file(path) {
        let data = '{}';
        try {
            data = fs.readFileSync(path, 'utf-8');
        } catch (err) {
            throw new Error(`no such file: ${path}`, { cause: err });
        }
        return data;
    }

    write_file(path, data) {

        let file_data = '';

        if (typeof data === "object") {
            file_data = JSON.stringify(data, null, 4);
        }
        else {
            file_data = data;
        }

        if (!file_data) {
            file_data = '{}';
        }
        fs.writeFile(path, data = file_data, (error) => {
            if (error) {
                console.log(`error is ${error.message}`);
            }
        });
    }
}

module.exports = Utils;