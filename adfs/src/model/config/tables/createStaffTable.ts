import { appPool } from "../";
import { DBTableNames } from "../../../utils";

/**
 * Creates the staff table
 */
export const createStaffTable = async function (): Promise<void> {
	const connection: any = await appPool.getConnection();

	try {
		console.log("creating staff_table...");

		await connection.query(`
			CREATE TABLE IF NOT EXISTS ${DBTableNames.staffTable} (
				id
					INT AUTO_INCREMENT PRIMARY KEY,

				name
					VARCHAR(255) NOT NULL UNIQUE,

				image_url
					VARCHAR(255) NOT NULL UNIQUE,

				role
					ENUM(
						'proprietor',
						'director',
						'admin',
						'secretary',
						'staff'
					)
					DEFAULT 'staff',

				created_at
					TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`);

		console.log("staff_table created...");
	} finally {
		connection.release();
	}
};
