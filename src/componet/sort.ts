export class Sort {
	flag: boolean;

	constructor(flag: boolean) {
		this.flag = flag;
	}

	quicksort(arr: number[] | string[], p: number, r: number) {
		if (p < r) {
			let q = this.rand_divide(arr, p, r);
			this.quicksort(arr, p, q - 1);
			this.quicksort(arr, q + 1, r);
		}
	}

	rand_divide(arr: number[] | string[], p: number, r: number): number {
		let i = Math.round(Math.random() * (r - p) + p);
		this.swap(arr, r, i);

		return this.divide(arr, p, r);
	}

	divide(arr: number[] | string[], p: number, r: number): number {
		let x = Number(arr[r]);
		let i = p - 1;
		for (let j = p; j <= r - 1; j++) {
			if (this.flag === true) {
				if (arr[j] <= x) {
					i += 1;
					this.swap(arr, i, j);
				}
			} else {
				if (arr[j] > x) {
					i += 1;
					this.swap(arr, i, j);
				}
			}
		}
		this.swap(arr, i + 1, r);

		return i + 1;
	}

	swap(arr: number[] | string[], i: number, j: number) {
		let temp = Number(arr[i]);
		arr[i] = Number(arr[j]);
		arr[j] = temp;
	}
}
