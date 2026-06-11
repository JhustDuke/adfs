// addToExistingGallery.ts (Astro route)
export const prerender = false;
import type { APIRoute } from "astro";
import { addToExistingGalleryModel } from "../../../model";

const allowedSize = 2 * 1024 * 1024; // 2MB
const MAX_IMAGES = 5;

export const POST: APIRoute = async function ({ request }) {
	try {
		const formData: FormData = await request.formData();

		const collectionId: number = Number(formData.get("collectionId"));
		if (!collectionId) throw new Error("Collection ID is required");

		const imageFiles = formData.getAll("images") as File[];

		if (!imageFiles.length) throw new Error("At least one image is required");
		if (imageFiles.length > MAX_IMAGES) {
			throw new Error(`No more than ${MAX_IMAGES} images can be added at once`);
		}

		const images = await Promise.all(
			imageFiles.map(async (file, i) => {
				if (file.size > allowedSize) {
					throw new Error(`Image ${i + 1} must not exceed 2MB`);
				}
				return {
					filename: file.name,
					buffer: Buffer.from(await file.arrayBuffer()),
					subcaption: String(formData.get(`subcaption_${i}`) || "").trim(),
				};
			})
		);

		await addToExistingGalleryModel({ collectionId, images });

		return new Response(
			JSON.stringify({ message: "Images added to gallery successfully" }),
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("addToExistingGallery error:", error);
		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to add images to gallery",
			}),
			{ status: 500 }
		);
	}
};
