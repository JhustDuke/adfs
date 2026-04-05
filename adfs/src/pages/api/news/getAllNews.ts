import type { APIRoute } from "astro";
import { allNewsModel } from "../../../model";

export const GET: APIRoute = async function () {
	try {
		const rows = await allNewsModel();

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
	}
};
