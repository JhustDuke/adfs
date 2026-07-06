// diagnosticModel.ts (or wherever your DB models live)
import { DBTableNames } from "../../utils";
import { appPool } from "../config";
appPool;

interface DiagnosticEntry {
	ip: string;
	page: string;
}

export async function insertAnalysticModel({
	ip,
	page,
}: DiagnosticEntry): Promise<void> {
	const now = new Date();
	const visitedDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
	const visitedTime = now.toTimeString().slice(0, 8); // HH:MM:SS

	const conn = await appPool.getConnection();
	try {
		await conn.query(
			`INSERT INTO ${DBTableNames.analytics} (ip, page, visited_date, visited_time) VALUES (?, ?, ?, ?)`,
			[ip, page, visitedDate, visitedTime]
		);
	} finally {
		conn.release();
	}
}
