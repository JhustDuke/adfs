import type { APIRoute } from "astro";
import { appPool } from "../../model";

export const GET: APIRoute = async () => {
	let connection;

	try {
		connection = await appPool.getConnection();
		await connection.query("SELECT 1"); //

		return new Response(JSON.stringify({ message: "DB is working" }), {
			status: 200,
		});
	} catch (error: unknown) {
		return new Response(JSON.stringify({ message: "DB failed", error }), {
			status: 500,
		});
	} finally {
		connection?.release();
	}
};
