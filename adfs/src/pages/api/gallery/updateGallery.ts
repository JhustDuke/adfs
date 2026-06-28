export const prerender = false;
import type { APIRoute } from "astro";
import { updateGalleryModel } from "../../../model";

interface UpdateImagePayload {
	filename: string;
	buffer: Buffer;
	subcaption?: string;
}

const allowedSize = 2 * 1024 * 1024; // 2MB
//update requires at most 1 image
const MIN_IMAGES = 1;
const MAX_IMAGES = 5;

export const PATCH: APIRoute = async function ({ request }) {
	try {
		const formData: FormData = await request.formData();

		const collectionId: number = Number(formData.get("collectionId"));
		if (!collectionId) throw new Error("Collection ID is required");

		const caption = formData.get("caption")
			? String(formData.get("caption")).trim()
			: undefined;

		const month = formData.get("month")
			? String(formData.get("month")).trim()
			: undefined;

		const year = formData.get("year")
			? Number(formData.get("year"))
			: undefined;

		const imageFiles = formData.getAll("images") as File[];

		let images: UpdateImagePayload[] | undefined;

		if (imageFiles.length > 0) {
			if (imageFiles.length < MIN_IMAGES) {
				throw new Error(`At least ${MIN_IMAGES} images are required`);
			}
			if (imageFiles.length > MAX_IMAGES) {
				throw new Error(`No more than ${MAX_IMAGES} images are allowed`);
			}

			images = await Promise.all(
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
		}

		await updateGalleryModel({ collectionId, caption, month, year, images });

		return new Response(
			JSON.stringify({ message: "Gallery updated successfully" }),
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("updateGallery error:", error);
		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to update gallery",
			}),
			{ status: 500 }
		);
	}
};
