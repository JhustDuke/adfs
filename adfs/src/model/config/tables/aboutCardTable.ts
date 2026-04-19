import { appPool } from "../";

export const createAboutCardsTable = async function (): Promise<void> {
	const connection = await appPool.getConnection();

	try {
		console.log("creating about_cards table...");

		await connection.query(`
			CREATE TABLE IF NOT EXISTS about_cards (
				id 
     INT AUTO_INCREMENT PRIMARY KEY,
				caption 
     VARCHAR(255) NOT NULL UNIQUE,
				image_url 
     TEXT NOT NULL,
				text_content 
     TEXT NOT NULL,
				created_at 
     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`);

		console.log("about_card table created...");
	} finally {
		connection.release();
	}
};
