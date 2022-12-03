const http = require('http');
const fs = require('fs');
const path = require('path');


json_path = path.resolve(__dirname, '../src/bilibili-api.json');

fs.readFile(json_path, 'utf-8', (error, _data) => {
    if (!error) {
        json_data = JSON.parse(_data)['get_comment'];
        let url = json_data['url'];
        let params = json_data['params'];
        params['oid'] = 511210837;
        let params_keys = Object.keys(params);

        params_keys.forEach((value, index) => {
            params_keys[index] = `${value}=${params[value]}`;
        });

        url = `${url}?${params_keys.join('&')}`;
        console.log(`url=${url}`);

        let body = '';
        let req = http.get(url, function (res) {
            console.log(`Got response: ${res.statusCode}`);
            res.on('data', function (d) {
                body += d;
            }).on('end', function () {
                console.log(res.headers)
                fetch_data = JSON.parse(body)['data'];
                fetch_keys = Object.keys(fetch_data);
                let content = fetch_data['top']['upper']['content'];
                let message = content['message'].split('\n');
                message.filter((value, index, arr) => {
                    let reg = /^0/;
                    if (reg.exec(value)){
                        return 1;
                    }
                })
                console.log(message);
            });
        }).on('error', function (e) {
            console.log(`Got error:  ${e.message}`);
        })
        req.end();
    }
})

