import type { APIRoute } from "astro";
import { getAllStaffsModel } from "../../../model";

export const GET: APIRoute = async function () {
	try {
		const allStaffs = await getAllStaffsModel();

		return new Response(JSON.stringify(allStaffs), {
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
