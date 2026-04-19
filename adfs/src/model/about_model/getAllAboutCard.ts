import { appPool } from "../config";

type AboutCardInterface = {
	id: number;
	title: string; // comes from caption
	textContent: string;
	imageSrc: string;
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
				id,
				caption AS title,
				text_content AS textContent,
				image_url AS imageSrc
			FROM about_cards
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
