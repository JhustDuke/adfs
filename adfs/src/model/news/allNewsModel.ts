import { appPool } from "../config";
import { DBTableNames } from "../../utils";

export const allNewsModel = async function (): Promise<any[]> {
	let connection;

	try {
		connection = await appPool.getConnection();

		const [rows] = await connection.query(
			`SELECT
			title,
			date	,
			full_text AS "fullText",
			category,
			excerpt
			FROM ${DBTableNames.newsTable} ORDER BY date DESC`
		);
		console.log(rows);
		return rows as any[];
	} catch (error: any) {
		console.log("getNews error:", error.message);
		throw error;
	} finally {
		if (connection) connection.release();
	}
};
