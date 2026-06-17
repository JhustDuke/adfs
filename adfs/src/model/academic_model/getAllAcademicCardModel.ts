import { DBTableNames } from "../../utils";
import { appPool } from "../config";

export interface AllAcademicDataInterface {
	id: number;
	title: string;
	textContent: string;
	imageSrc: string;
	textCaptionColor?: string | undefined;
	bgColor?: string | undefined;
}

/**
 * GET ALL Academic CARDS
 */
export const getAllAcademicCardsModel = async function (): Promise<
	AllAcademicDataInterface[]
> {
	let connection;

	try {
		connection = await appPool.getConnection();

		const [rows] = (await connection.query(
			`
			SELECT 
				id,
				caption AS title,
				excerpts AS textContent,
				image_url AS imageSrc,
    text_caption_color AS textCaptionColor,
				bg_color AS bgColor
				
			FROM ${DBTableNames.academicTable}
			`
		)) as [AllAcademicDataInterface[], unknown];

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
