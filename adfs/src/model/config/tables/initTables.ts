import { createNewsTable } from "./createNewsTable";

export const initTables = async function (): Promise<void> {
	try {
		console.log("Creating tables...");

		await createNewsTable();

		console.log("Tables created successfully");
	} catch (error: unknown) {
		console.error("Table creation failed:", error);
		throw error; // important: let init.ts handle exit
	}
};
