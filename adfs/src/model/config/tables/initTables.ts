import { createNewsTable } from "./createNewsTable";
import { createAcademicPageTable } from "./createAcademicTables";
import { createAboutCardsTable } from "./aboutCardTable";
import { createStaffTable } from "./createStaffTable";

export const initTables = async function (): Promise<void> {
	try {
		console.log("Creating tables...");

		await createNewsTable();
		await createAcademicPageTable();
		await createAboutCardsTable();
		await createStaffTable();

		console.log("Tables created successfully");
	} catch (error: unknown) {
		console.error("Table creation failed:", error);
		throw error; // important: let init.ts handle exit
	}
};
