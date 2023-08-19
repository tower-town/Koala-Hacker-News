export interface JsonData {
	[bvid: string]: BvidData;
}

export interface BvidData {
	title: string;
	aid: number;
	bvid: string;
	pubdate: number;
	source: string[];
	data: IntroData[];
}

export interface IntroData {
	name: string;
	intro: string;
	link: string;
}

export interface Response {
	code: number;
	message: string;
	ttl: number;
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: Record<string, any>;
}
