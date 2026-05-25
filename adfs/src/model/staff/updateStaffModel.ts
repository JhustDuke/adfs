import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { ensureUploadDir, imageDir, DBTableNames } from "../../utils";

interface UpdateStaffInputInterface {
	id: number;
	name: string;
	role: string;
	imageBuffer?: Buffer | null;
	imageOriginalName?: string | null;
}

const imagePath = imageDir.staffImagePath;
const uploadDir: string = path.join(process.cwd(), imagePath);

export const updateStaffModel = async function (
	input: UpdateStaffInputInterface
): Promise<void> {
	let connection: any;
	try {
		connection = await appPool.getConnection();

		if (input.imageBuffer && input.imageOriginalName) {
			ensureUploadDir(uploadDir);

			// --- FETCH OLD IMAGE URL ---
			const [rows]: any = await connection.query(
				`SELECT image_url FROM ${DBTableNames.staffTable} WHERE id = ?`,
				[input.id]
			);

			if (!rows.length) {
				throw new Error("Staff member not found");
			}

			const oldImageUrl: string = rows[0].image_url;
			const oldImagePath: string = path.join(process.cwd(), oldImageUrl);

			// --- VALIDATE NEW IMAGE ---
			const fileName: string = input.imageOriginalName;
			const finalPath: string = path.join(uploadDir, fileName);

			if (fs.existsSync(finalPath)) {
				throw new Error("Image name already exists");
			}

			const newImageUrl: string = `${imagePath}/${fileName}`;

			// --- UPDATE DB ---
			await connection.query(
				`
        UPDATE ${DBTableNames.staffTable}
        SET name = ?, role = ?, image_url = ?
        WHERE id = ?
        `,
				[input.name, input.role, newImageUrl, input.id]
			);

			// --- SWAP FILES (delete old, write new) ---
			if (fs.existsSync(oldImagePath)) {
				fs.unlinkSync(oldImagePath);
			}
			fs.writeFileSync(finalPath, input.imageBuffer);
		} else {
			// --- NAME AND ROLE ONLY ---
			await connection.query(
				`
        UPDATE ${DBTableNames.staffTable}
        SET name = ?, role = ?
        WHERE id = ?
        `,
				[input.name, input.role, input.id]
			);
		}
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
