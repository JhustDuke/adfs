import { appPool } from "../config";
import { DBTableNames } from "../../utils";

export const getAllStaffsModel = async function (): Promise<any[]> {
	let connection;

	try {
		connection = await appPool.getConnection();

		const [rows] = await connection.query(
			`SELECT 
     id,
     name,
     image_url AS imageUrl,
     role
    FROM ${DBTableNames.staffTable} 
    ORDER BY FIELD(role, 'proprietor', 'director', 'admin', 'secretary', 'staff')`
		);

		return rows as any[];
	} finally {
		if (connection) connection.release();
	}
};
