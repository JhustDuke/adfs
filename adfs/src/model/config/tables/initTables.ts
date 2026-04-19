import { createNewsTable } from "./createNewsTable";
import {
	createAcademicCollectionsTable,
	createAcademicFilesTable,
} from "./createAcademicTables";
import { createAboutCardsTable } from "./aboutCardTable";

export const initTables = async function (): Promise<void> {
	try {
		console.log("Creating tables...");

		await createNewsTable();
		await createAcademicCollectionsTable();
		await createAcademicFilesTable();
		await createAboutCardsTable();

		console.log("Tables created successfully");
	} catch (error: unknown) {
		console.error("Table creation failed:", error);
		throw error; // important: let init.ts handle exit
	}
};
