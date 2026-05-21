import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { imageDir, DBTableNames } from "../../utils";

const imagePath = imageDir.academicImagesPath; // Assuming you have this
const uploadDir: string = path.join(process.cwd(), imagePath);

const extractFileName = function (url: string): string {
	return url.split("/").pop() || "";
};

/**
 * DELETE ACADEMIC PAGE ITEM
 */
export const deleteAcademicPageModel = async function (
	id: number
): Promise<void> {
	let connection;

	try {
		connection = await appPool.getConnection();

		// Get existing record to find image
		const [rows] = (await connection.query(
			`SELECT image_url FROM ${DBTableNames.academicTable} WHERE id = ?`,
			[id]
		)) as [any[], unknown];

		if (!rows || rows.length === 0) {
			throw new Error(`No academic page item found with id "${id}"`);
		}

		const imageUrl: string | null = rows[0]?.image_url;

		// Delete DB record first
		await connection.query(
			`DELETE FROM ${DBTableNames.academicTable} WHERE id = ?`,
			[id]
		);

		// Delete image file if exists
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
			`deleteAcademicPageModel failed: ${error.message || "unknown error"}`
		);
	} finally {
		if (connection) connection.release();
	}
};
