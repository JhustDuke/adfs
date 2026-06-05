// createGalleryTable.ts

import { appPool } from "../";
import { DBTableNames } from "../../../utils";

/**
 * Parent: folders (gallery collections)
 * Child: images (gallery content)
 */
export const createGalleryTable = async function (): Promise<void> {
	const connection = await appPool.getConnection();

	try {
		console.log("Creating gallery tables...");

		await connection.query(`
			CREATE TABLE IF NOT EXISTS ${DBTableNames.galleryCollections} (
				id 
					INT AUTO_INCREMENT PRIMARY KEY,

				caption 
					VARCHAR(255) NOT NULL UNIQUE,

				month 
					VARCHAR(20) NOT NULL,

				year 
					YEAR NOT NULL,

				created_at 
					TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`);

		await connection.query(`
			CREATE TABLE IF NOT EXISTS ${DBTableNames.collectionImages} (
				id 
					INT AUTO_INCREMENT PRIMARY KEY,

				collection_id 
					INT NOT NULL,

				url 
					TEXT NOT NULL UNIQUE,

				subcaption 
					VARCHAR(255) DEFAULT '',

				created_at 
					TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

				FOREIGN KEY (collection_id)
					REFERENCES ${DBTableNames.galleryCollections}(id)
					ON DELETE CASCADE
			)
		`);

		console.log("Gallery tables created successfully");
	} catch (err: any) {
		console.error("Gallery table creation failed:", err.message);
		throw err;
	} finally {
		connection.release();
	}
};

export const createImagesTable = async function (): Promise<void> {
	const connection = await appPool.getConnection();

	try {
		console.log("Creating images tables...");

		await connection.query(`
			CREATE TABLE IF NOT EXISTS ${DBTableNames.collectionImages} (
				id 
					INT AUTO_INCREMENT PRIMARY KEY,

				collection_id 
					INT NOT NULL,

				url 
					TEXT NOT NULL UNIQUE,

				subcaption 
					VARCHAR(255) DEFAULT '',

				created_at 
					TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

				FOREIGN KEY (collection_id)
					REFERENCES ${DBTableNames.galleryCollections}(id)
					ON DELETE CASCADE
			)
		`);

		console.log("Gallery tables created successfully");
	} catch (err: any) {
		console.error("Gallery table creation failed:", err.message);
		throw err;
	} finally {
		connection.release();
	}
};
