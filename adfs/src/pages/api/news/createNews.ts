import type { APIRoute } from "astro";
import { appPool } from "../../../model";

export const GET: APIRoute = async () => {
	let connection;

	try {
		connection = await appPool.getConnection();

		const [rows] = await connection.query(
			"SELECT * FROM news ORDER BY date DESC"
		);

		return new Response(JSON.stringify(rows), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} finally {
		connection?.release();
	}
};
