const http = require('http');
const fs = require('fs');

fs.readFile('./src/url.json', 'utf-8', (error, _data) => {
    if (!error) {
        json_data = JSON.parse(_data)['get_comment'];
        let url = json_data['url'];
        let params = json_data['params'];
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
                console.log(JSON.parse(body)['data']['archives'])
            });
        }).on('error', function (e) {
            console.log(`Got error:  ${e.message}`);
        })
        req.end();
    }
})

