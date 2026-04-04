import type { APIRoute } from "astro";
import { appPool } from "../../../model";

export const GET: APIRoute = async function () {
	let connection;

	try {
		connection = await appPool.getConnection();
		await connection.query("SELECT 1"); //

		return new Response(JSON.stringify({ message: "all news " }), {
			status: 200,
		});
	} catch (error: unknown) {
		return new Response(
			JSON.stringify({ message: "failed to get news", error }),
			{
				status: 500,
			}
		);
	} finally {
		connection?.release();
	}
};
