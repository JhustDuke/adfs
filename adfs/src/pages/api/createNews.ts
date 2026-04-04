import type { APIRoute } from "astro";
import { appPool } from "../../model";

export const POST: APIRoute = async ({ request }) => {
	const connection = await appPool.getConnection();

	try {
		const body = await request.json();

		const { title, excerpt, full_text, date } = body;

		await connection.query(
			`INSERT INTO news (title, excerpt, full_text, date)
       VALUES (?, ?, ?, ?)`,
			[title, excerpt, full_text, date]
		);

		return new Response(JSON.stringify({ message: "News created" }), {
			status: 201,
		});
	} catch (error: unknown) {
		return new Response(
			JSON.stringify({ message: "Failed to create news", error }),
			{ status: 500 }
		);
	} finally {
		connection.release();
	}
};
