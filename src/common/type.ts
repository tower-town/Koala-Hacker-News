export interface JsonData {
	[bvid: string]: BvidData;
}

export interface BvidData {
	title: string;
	aid: number;
	bvid: string;
	pubdate: number;
	source: string[] | undefined;
	data: IntroJson[] | undefined;
	ai: string[] | undefined;
}

export interface IntroJson {
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
