const Info = require('./componet/info')
const info = require('./componet/info')


/*
url = {
    "get_aids": {
        "url": 'https://api.bilibili.com/x/polymer/space/seasons_archives_list',
        "params": {
            'mid': '489667127',
            'season_id': '249279',
            'sort_reverse': 'false',
            'page_num': str(page_num),
            'page_size': '30'
        }
    },
    "get_commit": {
        "url": 'http://api.bilibili.com/x/v2/reply/main',
        "params": {
            'type': 1,
            'oid': aid
        }
    },
    "get_title": {
        "url": "http://api.bilibili.com/x/web-interface/view"
        "params": {
            'aid': aid
        }
    }
    ""
}

*/

Info.fetchJson();
