export const prerender = false;
import type { APIRoute } from "astro";
import { getAnalysticModel } from "../../model";

export const GET: APIRoute = async function () {
	try {
		const data = await getAnalysticModel();
		return new Response(JSON.stringify({ data }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err: any) {
		const message = err.message || "failed to get diagnostics data";
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
