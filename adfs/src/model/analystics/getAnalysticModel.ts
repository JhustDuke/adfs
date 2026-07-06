// src/model/diagnosticModel.ts (add alongside insertAnalysticModel)



import { DBTableNames } from "../../utils";
import { appPool } from "../config";



interface DiagnosticRow {
	id: number;
	ip: string;
	page: string;
	visited_date: string;
	visited_time: string;
}

export async function getAnalysticModel(): Promise<DiagnosticRow[]> {
	const conn = await appPool.getConnection();
	try {
		return await queryDiagnostics(conn);
	} finally {
		conn.release();
	}
}

// --- HELPERS ---
async function queryDiagnostics(conn: any): Promise<DiagnosticRow[]> {
	const [rows] = await conn.query(
		`SELECT id, ip, page, visited_date, visited_time FROM ${DBTableNames.analytics} ORDER BY id DESC LIMIT 200`
	);
	return rows;
}
