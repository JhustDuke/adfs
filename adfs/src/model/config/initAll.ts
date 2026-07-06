import { dropAllTables } from "../../utils/dropAllTable";
import { initTables } from "./tables/initTables";

///
export async function initAll() {
	try {
		console.log("database init started");

		//await dropAllTables();
		await initTables();

		console.log("Init complete");
	} catch (error: any) {
		console.error(error.message || "failed to init database");
	}
}
