// createDatabase.ts
import * as mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

export const createDatabase = async function (): Promise<void> {
	const connection = await mysql.createConnection({
		host: process.env.DB_HOST as string,
		user: process.env.DB_USER as string,
		password: process.env.DB_PASSWORD as string,
	});
	try {
		await connection.query(
			`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
		);

		console.log("Database created");
	} catch (err: any) {
		throw err;
	} finally {
		await connection.end();
	}
};
