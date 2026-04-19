import { appPool } from "../config";
import fs from "fs";
import path from "path";

const uploadDir: string = path.join(
	process.cwd(),
	"public/images/aboutCardImg"
);

const extractFileName = function (url: string): string {
	return url.split("/").pop() || "";
};

/**
 * DELETE ABOUT CARD
 */
export const deleteAboutCardModel = async function (id: number): Promise<void> {
	let connection;

	try {
		connection = await appPool.getConnection();

		// get existing record (to find image)
		const [rows] = (await connection.query(
			`SELECT image_url FROM about_cards WHERE id = ?`,
			[id]
		)) as [any[], unknown];

		if (!rows || rows.length === 0) {
			throw new Error(`No about card found with id "${id}"`);
		}

		const imageUrl: string | null = rows[0]?.image_url;

		// delete DB record first
		await connection.query(`DELETE FROM about_cards WHERE id = ?`, [id]);

		// delete image file if exists
		if (imageUrl) {
			const fileName = extractFileName(imageUrl);
			const filePath = path.join(uploadDir, fileName);

			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
			}
		}
	} catch (error: any) {
		if (error.code && error.sqlMessage) {
			throw new Error(`SQL Error [${error.code}]: ${error.sqlMessage}`);
		}

		throw new Error(
			`deleteAboutCardModel failed: ${error.message || "unknown error"}`
		);
	} finally {
		if (connection) connection.release();
	}
};
