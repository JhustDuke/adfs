import { createDB } from "../create-db";
import { createNewsTable } from "./createNewsTable";
import { createAcademicPageTable } from "./createAcademicTables";
import { createAboutCardsTable } from "./aboutCardTable";
import { createStaffTable } from "./createStaffTable";
import { createGalleryTable, createImagesTable } from "./createGalleryTable";

export const initTables = async function (): Promise<void> {
	try {
		await createDB();

		console.log("Creating tables...");

		await createNewsTable();
		await createAcademicPageTable();
		await createAboutCardsTable();
		await createStaffTable();
		await createGalleryTable();
		await createImagesTable();

		console.log("Tables created successfully");
	} catch (error: unknown) {
		console.error("Table creation failed:", error);
		throw error; // important: let init.ts handle exit
	}
};
