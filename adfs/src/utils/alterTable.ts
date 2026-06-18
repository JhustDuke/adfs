// alterTableColumn.ts
import { appPool } from "../model/config";
import { DBTableNames } from "./";
/**
 * Alters a single column's definition on a table (DEV ONLY)
 * Example: alterTableColumn("gallery_photos", "url", "VARCHAR(255) NOT NULL UNIQUE")
 */
export const alterTableColumn = async function (
	tableName: string,
	columnName: string,
	newDefinition: string
): Promise<void> {
	const validTableNames = Object.values(DBTableNames) as string[];

	if (!validTableNames.includes(tableName)) {
		throw new Error(
			`"${tableName}" is not a recognized table. Valid tables: ${validTableNames.join(
				", "
			)}`
		);
	}

	// basic guard: column names should only contain letters, numbers, underscores
	if (!/^[a-zA-Z0-9_]+$/.test(columnName)) {
		throw new Error(`"${columnName}" is not a valid column name`);
	}

	const connection = await appPool.getConnection();
	try {
		console.log(`altering ${tableName}.${columnName}.....`);
		await connection.query(
			`ALTER TABLE \`${tableName}\` MODIFY COLUMN \`${columnName}\` ${newDefinition}`
		);
		console.log(`${tableName}.${columnName} altered to: ${newDefinition}`);
	} catch (err: any) {
		console.error(`failed to alter ${tableName}.${columnName}`);
		throw err;
	} finally {
		connection.release();
	}
};
