import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { ensureUploadDir, imageDir,DBTableNames } from "../../utils";

interface UpdateAboutCardInputInterface {
	id: number;
	caption: string;
	textContent: string;
	imageBuffer?: Buffer;
	imageOriginalName?: string;
}

const imagePath = imageDir.aboutImagePath;
const tableName=DBTableNames.aboutTable

const uploadDir: string = path.join(process.cwd(), imagePath);

const extractFileName = function (url: string): string {
	return url.split("/").pop() || "";
};

/**
 * PATCH ABOUT CARD (safe image handling + collision protection)
 */
export const updateAboutCardModel = async function (
	input: UpdateAboutCardInputInterface
): Promise<void> {
	let connection;

	try {
		connection = await appPool.getConnection();

		ensureUploadDir(uploadDir);

		// get existing record
		const [rows] = (await connection.query(
			`SELECT id, image_url FROM ${tableName}  WHERE id = ?`,
			[input.id]
		)) as [any[], unknown];

		if (!rows || rows.length === 0) {
			throw new Error(`No about card found with id "${input.id}"`);
		}

		const existingImageUrl: string | null = rows[0]?.image_url;

		let newImageUrl: string | undefined;

		// IMAGE UPDATE (optional)
		if (input.imageBuffer && input.imageOriginalName) {
			const fileName = input.imageOriginalName;
			const newPath = path.join(uploadDir, fileName);
			newImageUrl = `${imagePath}/${fileName}`;

			// collision check
			if (fs.existsSync(newPath)) {
				const [existingRows] = (await connection.query(
					`SELECT id FROM ${tableName} WHERE image_url = ?`,
					[newImageUrl]
				)) as [any[], unknown];

				const isSameRecord = existingRows?.[0]?.id === input.id;

				if (!isSameRecord) {
					throw new Error(
						`Image "${fileName}" already exists. Please change/rename the file before uploading.`
					);
				}
			}

			// delete old image if different
			if (existingImageUrl) {
				const oldFileName = extractFileName(existingImageUrl);
				const oldPath = path.join(uploadDir, oldFileName);

				if (fs.existsSync(oldPath) && oldFileName !== fileName) {
					fs.unlinkSync(oldPath);
				}
			}

			// write new image
			fs.writeFileSync(newPath, input.imageBuffer);
		}

		// update DB
		if (newImageUrl) {
			await connection.query(
				`
				UPDATE ${tableName}
				SET caption = ?, text_content = ?, image_url = ?
				WHERE id = ?
				`,
				[input.caption, input.textContent, newImageUrl, input.id]
			);
		} else {
			await connection.query(
				`
				UPDATE ${tableName}
				SET caption = ?, text_content = ?
				WHERE id = ?
				`,
				[input.caption, input.textContent, input.id]
			);
		}
	} catch (error: any) {
		if (error.code && error.sqlMessage) {
			throw new Error(`SQL Error [${error.code}]: ${error.sqlMessage}`);
		}

		throw new Error(
			`updateAboutCardModel failed: ${error.message || "unknown error"}`
		);
	} finally {
		if (connection) connection.release();
	}
};
