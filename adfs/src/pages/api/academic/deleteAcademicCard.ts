export const prerender = false;

import type { APIRoute } from "astro";
import { deleteAcademicPageModel } from "../../../model";

export const DELETE: APIRoute = async function ({ request }) {
	try {
		const body = await request.json();
		const id: number = Number(body.id);

		if (!id) {
			throw new Error("ID is required");
		}

		await deleteAcademicPageModel(id);

		return new Response(
			JSON.stringify({
				message: "Academic page item deleted successfully",
			}),
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("deleteAcademicPage error:", error);

		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to delete academic page item",
			}),
			{ status: 500 }
		);
	}
};
