
export interface JsonData {
	[bvid: string]: {
		title: string;
		aid: number;
		bvid: string;
		pubdate: number;
		data?: IntroData[];
	};
}

export interface IntroData {
	name: string;
	intro: string;
	link: string;
}

