import { Startup } from "../src/controler/main";
import { View } from "../src/view/main";

const startup = new Startup();
const view = new View();

(async () => {
	try {
		await startup.init();
		const hnlist = await startup.hnlist();
		await view.display(hnlist);
	} catch (err) {
		throw Error(`${err}`);
	}
})();
