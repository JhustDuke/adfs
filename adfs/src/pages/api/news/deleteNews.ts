export const prerender = false;

import type { APIRoute } from "astro";
import { deleteNewsModel } from "../../../model";

export const DELETE: APIRoute = async function ({ request }) {
	try {
		const body = await request.json();

		const { title } = body;

		if (!title) {
			return new Response(JSON.stringify({ error: "title is required" }), {
				status: 400,
			});
		}

		await deleteNewsModel(title);

		return new Response(
			JSON.stringify({ message: "News deleted successfully" }),
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("deleteNews error:", error);

		return new Response(
			JSON.stringify({
				error: error?.message || "Failed to delete news",
			}),
			{ status: 500 }
		);
	}
};
