const Sort = require('../src/componet/sort');
const HackerNews = require('../src/componet/HackerNews')


test("test quicksort", () => {
    let rand_list = [1, 6, 3, 9, 8, 67, 25, 4, 10, 7, 45, 89];

    let sort = new Sort(flag=1);
    sort.quicksort(rand_list, 0, rand_list.length - 1);

    let expect_list = [1, 3, 4, 6, 7, 8, 9, 10, 25, 45, 67, 89]
    expect(rand_list).toEqual(expect_list);
})

test("test sort json data", () => {
    let json_data = {
        "two": {
            "pubdate": 2
        },
        "one": {
            "pubdate": 1
        },
        "three": {
            "pubdate": 3
        }
    }

    let expect_json = {
        "three": {
            "pubdate": 3
        },
        "two": {
            "pubdate": 2
        },
        "one": {
            "pubdate": 1
        }
    }

    let HN = new HackerNews;
    let recieve_json = HN.sort_json(json_data);

    expect(recieve_json).toStrictEqual(expect_json);
    
    let recieve_json_str = JSON.stringify(recieve_json);
    let json_data_str = JSON.stringify(expect_json);

    expect(recieve_json_str).toBe(json_data_str);
})