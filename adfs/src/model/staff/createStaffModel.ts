import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { ensureUploadDir, imageDir, DBTableNames } from "../../utils";

interface CreateStaffInputInterface {
	name: string;
	role: string;
	imageBuffer: Buffer;
	imageOriginalName: string;
}

const imagePath = imageDir.staffImagePath;
const uploadDir: string = path.join(process.cwd(), imagePath);

export const createStaffModel = async function (
	input: CreateStaffInputInterface
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

		const imageUrl: string = `${imagePath}/${fileName}`;

		await connection.query(
			`
      INSERT INTO ${DBTableNames.staffTable} (name, image_url, role)
      VALUES (?, ?, ?)
      `,
			[input.name, imageUrl, input.role]
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
