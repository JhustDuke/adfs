import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { ensureUploadDir } from "../../utils";

interface CreateAcademicPageInputInterface {
	caption: string;
	excerpts: string;
	imageBuffer: Buffer;
	imageOriginalName: string;
	textCaptionColor?: string | null;
	bgColor?: string | null;
}

const uploadDir: string = path.join(
	process.cwd(),
	"public/images/academicPageImg"
);

export const createAcademicPageModel = async function (
	input: CreateAcademicPageInputInterface
): Promise<void> {
	let connection: any;

	try {
		connection = await appPool.getConnection();

		ensureUploadDir(uploadDir);

		const fileName: string = input.imageOriginalName;
		const finalPath: string = path.join(uploadDir, fileName);

		if (fs.existsSync(finalPath)) {
			throw new Error("Image name already exists");
		}

		const imageUrl: string = `/images/academicPageImg/${fileName}`;

		await connection.query(
			`
				INSERT INTO academic_page_table (
					caption,
					excerpts,
					image_url,
					text_caption_color,
					bg_color
				)
				VALUES (?, ?, ?, ?, ?)
			`,
			[
				input.caption,
				input.excerpts,
				imageUrl,
				input.textCaptionColor ?? "",
				input.bgColor ?? "",
			]
		);

		fs.writeFileSync(finalPath, input.imageBuffer);
	} catch (error: any) {
		if (error.code && error.sqlMessage) {
			throw new Error(`SQL Error [${error.code}]: ${error.sqlMessage}`);
		}

		console.log(error);
		throw new Error(error.message || "An unexpected error occurred");
	} finally {
		if (connection) connection.release();
	}
};
