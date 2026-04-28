import { DBTableNames } from "../../utils";
import { appPool } from "../config";


export const deleteNewsModel = async function (title: string): Promise<void> {
	let connection;

	try {
		connection = await appPool.getConnection();

		const query = `
			DELETE FROM ${DBTableNames.newsTable}
			WHERE title = ?
		`;

		const [result]: any = await connection.execute(query, [title]);

		if (result.affectedRows === 0) {
			throw new Error("No news found to delete");
		}
	} catch (error: any) {
		console.error("deleteNewsModel error:", error);
		throw error;
	} finally {
		if (connection) connection.release();
	}
};
