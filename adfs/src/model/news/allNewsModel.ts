import { appPool } from "../config";

export const allNewsModel = async function (): Promise<any[]> {
	let connection;

	try {
		connection = await appPool.getConnection();

		const [rows] = await connection.query(
			"SELECT * FROM news_table ORDER BY date DESC"
		);

		return rows as any[];
	} finally {
		if (connection) connection.release();
	}
};
