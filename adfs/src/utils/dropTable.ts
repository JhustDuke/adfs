// dropTable.ts
import { appPool } from "../model/config";
import { DBTableNames } from "./";

/**
 * Drops a single table by name (DEV ONLY)
 */
export const dropTable = async function (tableName: string): Promise<void> {
	const validTableNames = Object.values(DBTableNames) as string[];

	if (!validTableNames.includes(tableName)) {
		throw new Error(
			`"${tableName}" is not a recognized table. Valid tables: ${validTableNames.join(
				", "
			)}`
		);
	}

	const connection = await appPool.getConnection();
	try {
		console.log(`dropping table ${tableName}.....`);
		await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
		console.log(`${tableName} dropped`);
	} catch (err: any) {
		console.error(`failed to drop ${tableName}`);
		throw err;
	} finally {
		connection.release();
	}
};
