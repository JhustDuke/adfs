import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { ensureUploadDir, imageDir, DBTableNames } from "../../utils";

interface UpdateAcademicPageInputInterface {
	id: number;

	caption?: string;
	excerpts?: string;

	imageBuffer?: Buffer;
	imageOriginalName?: string;

	textCaptionColor?: string | null;
	bgColor?: string | null;
}

const imagePath = imageDir.academicImagesPath;

const tableName = DBTableNames.academicTable;

const uploadDir: string = path.join(process.cwd(), imagePath);

const extractFileName = function (url: string): string {
	return url.split("/").pop() || "";
};

/**
 * PATCH ACADEMIC PAGE
 */
export const updateAcademicPageModel = async function (
	input: UpdateAcademicPageInputInterface
): Promise<void> {
	let connection;

	try {
		connection = await appPool.getConnection();

		ensureUploadDir(uploadDir);

		// get existing record
		const [rows] = (await connection.query(
			`
				SELECT *
				FROM ${tableName}
				WHERE id = ?
			`,
			[input.id]
		)) as [any[], unknown];

		if (!rows || rows.length === 0) {
			throw new Error(`No academic page found with id "${input.id}"`);
		}

		const existingAcademic = rows[0];

		// REFACTORED: caption uniqueness validation
		if (input.caption) {
			const [captionRows] = (await connection.query(
				`
					SELECT id
					FROM ${tableName}
					WHERE caption = ?
				`,
				[input.caption]
			)) as [any[], unknown];

			const isSameRecord = captionRows?.[0]?.id === input.id;

			if (captionRows.length && !isSameRecord) {
				throw new Error(`Caption "${input.caption}" already exists`);
			}
		}

		let newImageUrl: string | undefined;

		// REFACTORED: optional image update handling
		if (input.imageBuffer && input.imageOriginalName) {
			const fileName = input.imageOriginalName;

			const newPath = path.join(uploadDir, fileName);

			newImageUrl = `${imagePath}/${fileName}`;

			// collision check
			if (fs.existsSync(newPath)) {
				const [existingRows] = (await connection.query(
					`
						SELECT id
						FROM ${tableName}
						WHERE image_url = ?
					`,
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
			if (existingAcademic.image_url) {
				const oldFileName = extractFileName(existingAcademic.image_url);

				const oldPath = path.join(uploadDir, oldFileName);

				if (fs.existsSync(oldPath) && oldFileName !== fileName) {
					fs.unlinkSync(oldPath);
				}
			}

			// write new image
			fs.writeFileSync(newPath, input.imageBuffer);
		}

		// REFACTORED: PATCH-style DB update
		if (newImageUrl) {
			await connection.query(
				`
					UPDATE ${tableName}
					SET
						caption = ?,
						excerpts = ?,
						image_url = ?,
						text_caption_color = ?,
						bg_color = ?
					WHERE id = ?
				`,
				[
					input.caption ?? existingAcademic.caption,

					input.excerpts ?? existingAcademic.excerpts,

					newImageUrl,

					input.textCaptionColor ?? existingAcademic.text_caption_color,

					input.bgColor ?? existingAcademic.bg_color,

					input.id,
				]
			);
		} else {
			await connection.query(
				`
					UPDATE ${tableName}
					SET
						caption = ?,
						excerpts = ?,
						text_caption_color = ?,
						bg_color = ?
					WHERE id = ?
				`,
				[
					input.caption ?? existingAcademic.caption,

					input.excerpts ?? existingAcademic.excerpts,

					input.textCaptionColor ?? existingAcademic.text_caption_color,

					input.bgColor ?? existingAcademic.bg_color,

					input.id,
				]
			);
		}
	} catch (error: any) {
		if (error.code && error.sqlMessage) {
			throw new Error(`SQL Error [${error.code}]: ${error.sqlMessage}`);
		}

		throw new Error(
			`updateAcademicPageModel failed: ${error.message || "unknown error"}`
		);
	} finally {
		if (connection) {
			connection.release();
		}
	}
};
