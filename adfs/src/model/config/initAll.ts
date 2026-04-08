import { initTables } from "./tables/initTables";

///
(async function init() {
	try {
		console.log("database init started");

		await initTables();

		console.log("Init complete");
	} catch (error: unknown) {
		console.error("Init failed:", error);
	}
})();
