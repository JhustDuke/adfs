// db.ts
import * as mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Creates a MySQL connection pool using env variables
 */
const createPool = function (): mysql.Pool {
	const pool: mysql.Pool = mysql.createPool({
		host: process.env.DB_HOST as string,
		port: Number(process.env.DB_PORT),
		user: process.env.DB_USER as string,
		password: process.env.DB_PASSWORD as string,
		waitForConnections: true,
		connectionLimit: 10,
	});

	return pool;
};

export const appPool: mysql.Pool = createPool();
