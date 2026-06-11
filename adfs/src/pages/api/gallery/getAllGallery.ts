// getAllGallery.ts  (Astro route)
export const prerender = false;
import type { APIRoute } from "astro";
import { getAllGalleryModel } from "../../../model";

export const GET: APIRoute = async function () {
	try {
		const galleries = await getAllGalleryModel();

		return new Response(JSON.stringify({ data: galleries }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error: any) {
		console.error("getAllGallery error:", error);
		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to fetch galleries",
			}),
			{ status: 500 }
		);
	}
};
