import { appPool } from "../";
import { DBTableNames } from "../../../utils";

export const createAnalyticsTable = async function () {
	const connection = await appPool.getConnection();

	try {
		console.log("creating analytics_table.....");
		await connection.query(`
    CREATE TABLE IF NOT EXISTS ${DBTableNames.analytics} (
     id 
      INT AUTO_INCREMENT PRIMARY KEY,
     ip 
      VARCHAR(45) NOT NULL,
     page 
      VARCHAR(255) NOT NULL,
    visited_date 
      DATE NOT NULL,
    visited_time 
      TIME NOT NULL,
    created_at 
     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

		console.log("analytics table created");
	} catch (err: any) {
		console.error("analytics table not created");
		throw err;
	} finally {
		connection.release();
	}
};
