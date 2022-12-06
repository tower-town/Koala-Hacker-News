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
        let x = arr[r];
        let i = p - 1;
        for (let j = p; j <= r - 1; j++) {
            if (this.flag === 1){
                if (arr[j] <= x) {
                    i += 1;
                    this.swap(arr, i, j);
                }
            }
            else{
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
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

module.exports = Sort;