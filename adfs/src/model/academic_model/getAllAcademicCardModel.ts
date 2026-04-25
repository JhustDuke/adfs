import { appPool } from "../config";

interface CreateAcademicPageInputInterface {
	caption: string;
	excerpts: string;
	imageBuffer: Buffer;
	imageOriginalName: string;
	textCaptionColor?: string | null;
	bgColor?: string | null;
}

/**
 * GET ALL Academic CARDS
 */
export const getAllAcademicCardsModel = async function (): Promise<
	CreateAcademicPageInputInterface[]
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
				
			FROM academic_page_table
			`
		)) as [CreateAcademicPageInputInterface[], unknown];

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
