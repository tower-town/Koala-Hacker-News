import { Service } from "@src/controller/main";
import { View } from "@src/view/main";

const service = new Service();
const view = new View();

(async () => {
	try {
		await service.init();
		const hnlist = await service.hnlist();
		await view.display(hnlist);
	} catch (err) {
		throw Error(`${err}`);
	}
})();
