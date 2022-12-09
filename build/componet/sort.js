"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sort = void 0;
class Sort {
    constructor(flag) {
        this.flag = flag;
    }
    quicksort(arr, p, r) {
        if (p < r) {
            let q = this.rand_divide(arr, p, r);
            this.quicksort(arr, p, q - 1);
            this.quicksort(arr, q + 1, r);
        }
    }
    rand_divide(arr, p, r) {
        let i = Math.round(Math.random() * (r - p) + p);
        this.swap(arr, r, i);
        return this.divide(arr, p, r);
    }
    divide(arr, p, r) {
        let x = Number(arr[r]);
        let i = p - 1;
        for (let j = p; j <= r - 1; j++) {
            if (this.flag === true) {
                if (arr[j] <= x) {
                    i += 1;
                    this.swap(arr, i, j);
                }
            }
            else {
                if (arr[j] > x) {
                    i += 1;
                    this.swap(arr, i, j);
                }
            }
        }
        this.swap(arr, i + 1, r);
        return i + 1;
    }
    swap(arr, i, j) {
        let temp = Number(arr[i]);
        arr[i] = Number(arr[j]);
        arr[j] = temp;
    }
}
exports.Sort = Sort;
