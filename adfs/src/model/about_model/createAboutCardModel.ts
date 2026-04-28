import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { ensureUploadDir, imageDir, DBTableNames } from "../../utils";

interface CreateAboutCardInputInterface {
	caption: string;
	textContent: string;
	imageBuffer: Buffer;
	imageOriginalName: string;
}

const imagePath = imageDir.aboutImagePath;
const uploadDir: string = path.join(process.cwd(), imagePath);
export const createAboutCardModel = async function (
	input: CreateAboutCardInputInterface
): Promise<void> {
	let connection;

	try {
		connection = await appPool.getConnection();

		ensureUploadDir(uploadDir);

		const fileName: string = input.imageOriginalName;
		const finalPath: string = path.join(uploadDir, fileName);

		if (fs.existsSync(finalPath)) {
			throw new Error("Image name already exists");
		}

		const imageUrl: string = `${imagePath}/${fileName}`;

		await connection.query(
			`
			INSERT INTO ${DBTableNames.aboutTable} (caption, image_url, text_content)
			VALUES (?, ?, ?)
			`,
			[input.caption, imageUrl, input.textContent]
		);

		//write to disk, after inserting into the db
		fs.writeFileSync(finalPath, input.imageBuffer);
	} catch (error: any) {
		if (error.code && error.sqlMessage) {
			// Handle SQL-specific errors
			throw new Error(`SQL Error [${error.code}]: ${error.sqlMessage}`);
		} else {
			console.log(error);
			// Fallback for other errors
			throw new Error(error.message || "An unexpected error occurred");
		}
	} finally {
		if (connection) connection.release();
	}
};
