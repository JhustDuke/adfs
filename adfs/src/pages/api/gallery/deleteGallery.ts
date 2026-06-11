// deleteGallery.ts (Astro route)
export const prerender = false;
import type { APIRoute } from "astro";
import { deleteGalleryModel, deleteGalleryImageModel } from "../../../model";

export const DELETE: APIRoute = async function ({ request }) {
	try {
		const body = await request.json();
		const { type, galleryDB_id, imageUrl } = body;

		if (!galleryDB_id) throw new Error("Gallery ID is required");
		if (!type) throw new Error("Delete type is required");

		if (type === "gallery") {
			await deleteGalleryModel(galleryDB_id);
			return new Response(
				JSON.stringify({ message: "Gallery deleted successfully" }),
				{ status: 200 }
			);
		}

		if (type === "image") {
			if (!imageUrl) throw new Error("Image URL is required");
			await deleteGalleryImageModel(galleryDB_id, imageUrl);
			return new Response(
				JSON.stringify({ message: "Image deleted successfully" }),
				{ status: 200 }
			);
		}

		throw new Error(`Unknown delete type: ${type}`);
	} catch (error: any) {
		console.error("deleteGallery error:", error);
		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to delete",
			}),
			{ status: 500 }
		);
	}
};
