// dropAllTables.ts
import { appPool } from "../model/config";
import { DBTableNames } from "./";

/**
 * Drops every table in DBTableNames (DEV ONLY)
 * Temporarily disables FK checks so table order doesn't matter
 */
export const dropAllTables = async function (): Promise<void> {
	const connection = await appPool.getConnection();
	try {
		console.log("dropping all tables.....");
		await connection.query("SET FOREIGN_KEY_CHECKS = 0");

		for (const tableName of Object.values(DBTableNames)) {
			await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
			console.log(`dropped ${tableName}`);
		}

		await connection.query("SET FOREIGN_KEY_CHECKS = 1");
		console.log("all tables dropped");
	} catch (err: any) {
		console.error("failed to drop all tables");
		throw err;
	} finally {
		connection.release();
	}
};
