import { appPool } from "../";
import { DBTableNames } from "../../../utils";

/**
 * Creates the academic page table
 */
export const createAcademicPageTable = async function (): Promise<void> {
	const connection: any = await appPool.getConnection();

	try {
		console.log("creating academic_page_table...");

		await connection.query(`
			CREATE TABLE IF NOT EXISTS ${DBTableNames.academicTable} (
				id
					INT AUTO_INCREMENT PRIMARY KEY,
				image_url
					TEXT NOT NULL,
				caption
					VARCHAR(255) NOT NULL UNIQUE,
				excerpts
					TEXT,
				href
					VARCHAR(255) DEFAULT '/gallery',
				text_caption_color
					VARCHAR(50) DEFAULT 'black-text',
				bg_color
					VARCHAR(50) DEFAULT '',
				created_at
					TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`);

		console.log("academic_page_table created...");
	} finally {
		connection.release();
	}
};
