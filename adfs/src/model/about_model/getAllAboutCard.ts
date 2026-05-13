import { DBTableNames } from "../../utils";
import { appPool } from "../config";

type AboutCardInterface = {
	id: number;
	caption: string; // comes from caption
	text_content: string;
	image_url: string;
};

/**
 * GET ALL ABOUT CARDS
 */
export const getAllAboutCardsModel = async function (): Promise<
	AboutCardInterface[]
> {
	let connection;

	try {
		connection = await appPool.getConnection();

		const [rows] = (await connection.query(
			`
			SELECT 
				id, caption AS title,image_url AS imageSrc,text_content AS textContent 
			FROM ${DBTableNames.aboutTable}
			`
		)) as [AboutCardInterface[], unknown];

		if (!rows || rows.length === 0) {
			console.log("no cards in DB"); // early return log
			return [];
		}

		return rows;
	} catch (error: unknown) {
		const err = error as Error;

		console.error("DB error:", err.message);

		throw new Error(err.message || "Database connection/query failed");
	} finally {
		if (connection) {
			connection.release();
		}
	}
};
