import { createNewsTable } from "./createNewsTable";
import { createAcademicPageTable } from "./createAcademicTables";
import { createAboutCardsTable } from "./aboutCardTable";
import { createStaffTable } from "./createStaffTable";
import { createGalleryTable, createImagesTable } from "./createGalleryTable";
import { createAnalyticsTable } from "./analyticsTable";

export const initTables = async function (): Promise<void> {
	try {
		console.log("Creating tables...");

		await createAnalyticsTable();
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
