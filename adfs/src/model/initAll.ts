import { createDatabase } from ".";
import { initTables } from "./initTables";

(async function init() {
	try {
		console.log("database init started");

		await createDatabase(); // must succeed first
		await initTables();

		console.log("Init complete");
	} catch (error: unknown) {
		console.error("Init failed:", error);
		process.exit(1);
	}
})();
