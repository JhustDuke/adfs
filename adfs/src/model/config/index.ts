import { createDB } from "./create-db";
import { initAll } from "./initAll";

async function bootstrapDB(): Promise<void> {
	try {
		await createDB();
		await initAll();
		console.log("✅ DB fully initialized.");
	} catch (err: any) {
		console.error(
			"❌ DB initialization failed. Some features may not work until this is resolved."
		);
		console.error(err.message || err);
	}
}

await bootstrapDB(); // top-level await — module doesn't finish loading until this resolves

export { appPool } from "./create-db";
