// createNewsTable.ts
import { appPool } from "./";

/**
 * Creates the news table
 */
export const createNewsTable = async function (): Promise<void> {
	const connection = await appPool.getConnection();

	try {
		await connection.query(`
    CREATE TABLE IF NOT EXISTS news (
      id 
       INT AUTO_INCREMENT PRIMARY KEY,
      title 
       VARCHAR(255) NOT NULL UNIQUE,
      category
       VARCHAR(100) NOT NULL,      
      excerpt 
       VARCHAR(500) NOT NULL,
      full_text 
       TEXT NOT NULL,
      date 
       DATETIME NOT NULL,
      created_at 
       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
    )
  `);

		console.log("News table ensured");
	} catch (err: any) {
		console.error("news table not created");
		throw err;
	} finally {
		connection.release();
	}
};
