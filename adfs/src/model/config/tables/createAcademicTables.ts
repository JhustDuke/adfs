// createAcademicTables.ts
import { appPool } from "../";

/**
 * Creates academic_collections table
 */
export const createAcademicCollectionsTable = async function (): Promise<void> {
	const connection = await appPool.getConnection();

	try {
		console.log("creating academic_collections.....");

		await connection.query(`
			CREATE TABLE IF NOT EXISTS academic_collections (
				id 
					INT AUTO_INCREMENT PRIMARY KEY,

				name 
					VARCHAR(100) NOT NULL UNIQUE,

				excerpt 
					VARCHAR(255) NOT NULL,

				created_at 
					TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`);

		console.log("academic_collections table ensured");
	} catch (err: any) {
		console.error("academic_collections table not created");
		throw err;
	} finally {
		connection.release();
	}
};

/**
 * Creates academic_files table
 */
export const createAcademicFilesTable = async function (): Promise<void> {
	const connection = await appPool.getConnection();

	try {
		console.log("creating academic_files.....");

		await connection.query(`
			CREATE TABLE IF NOT EXISTS academic_files (
				id 
					INT AUTO_INCREMENT PRIMARY KEY,

				collection_id 
					INT NOT NULL,

				image_url 
					VARCHAR(500) NOT NULL,

				person_name 
					VARCHAR(150),

				role 
					ENUM('proprietor', 'director', 'admin', 'secretary', 'staff') NOT NULL,

				created_at 
					TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

				FOREIGN KEY (collection_id)
				REFERENCES academic_collections(id)
				ON DELETE CASCADE
			)
		`);

		console.log("academic_files table ensured");
	} catch (err: any) {
		console.error("academic_files table not created");
		throw err;
	} finally {
		connection.release();
	}
};
