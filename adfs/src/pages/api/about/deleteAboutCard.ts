export const prerender = false;

import type { APIRoute } from "astro";
import { deleteAboutCardModel } from "../../../model";

export const DELETE: APIRoute = async function ({ request }) {
	try {
		const body = await request.json();

		const id: number = Number(body.id);

		if (!id) {
			throw new Error("ID is required");
		}

		await deleteAboutCardModel(id);

		return new Response(
			JSON.stringify({
				message: "About card deleted successfully",
			}),
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("deleteAboutCard error:", error);

		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to delete about card",
			}),
			{ status: 500 }
		);
	}
};
