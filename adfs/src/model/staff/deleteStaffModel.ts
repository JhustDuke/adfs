import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { DBTableNames } from "../../utils";

export const deleteStaffModel = async function (id: number): Promise<void> {
	let connection: any;
	try {
		connection = await appPool.getConnection();

		// --- FETCH IMAGE URL BEFORE DELETE ---
		const [rows]: any = await connection.query(
			`SELECT image_url FROM ${DBTableNames.staffTable} WHERE id = ?`,
			[id]
		);

		if (!rows.length) {
			throw new Error("Staff member not found");
		}

		const oldImagePath: string = path.join(process.cwd(), rows[0].image_url);

		// --- DELETE FROM DB ---
		await connection.query(
			`DELETE FROM ${DBTableNames.staffTable} WHERE id = ?`,
			[id]
		);

		// --- DELETE IMAGE FROM DISK ---
		if (fs.existsSync(oldImagePath)) {
			fs.unlinkSync(oldImagePath);
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
