import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Admin connection (NO DB)
const conn = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	port: Number(process.env.DB_PORT),
	waitForConnections: true,
	connectionLimit: 10,
});

// App pool (WITH DB)
export const appPool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_NAME as string,
	waitForConnections: true,
	connectionLimit: 10,
});

export async function createDB(): Promise<void> {
	let connRef;

	try {
		connRef = await conn.getConnection();

		await connRef.query(
			`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
		);

		console.log("✅ Database ready.");
	} catch (err: any) {
		const msg =
			err?.sqlMessage || err?.message || err?.code || "Unknown DB error";

		console.error("❌ DB init error:", msg);
		throw new Error(msg);
	} finally {
		if (connRef) connRef.release();
	}
}
