export const prerender = false;
import type { APIRoute } from "astro";
import { createGalleryModel } from "../../../model";

const allowedSize = 2 * 1024 * 1024; // 2MB
const MIN_IMAGES = 3;
const MAX_IMAGES = 5;

export const POST: APIRoute = async function ({ request }) {
	try {
		const formData: FormData = await request.formData();

		const caption: string = String(formData.get("caption") || "").trim();
		const month: string = String(formData.get("month") || "").trim();
		const year: number = Number(formData.get("year"));

		if (!caption) throw new Error("Caption is required");
		if (!month) throw new Error("Month is required");
		if (!year) throw new Error("Year is required");

		// collect all image fields
		const imageFiles = formData.getAll("images") as File[];

		if (imageFiles.length < MIN_IMAGES) {
			throw new Error(`At least ${MIN_IMAGES} images are required`);
		}
		if (imageFiles.length > MAX_IMAGES) {
			throw new Error(`No more than ${MAX_IMAGES} images are allowed`);
		}

		const images = await Promise.all(
			imageFiles.map(async (file, i) => {
				if (file.size > allowedSize) {
					throw new Error(`Image ${i + 1} must not exceed 2MB`);
				}
				const subcaption = String(formData.get(`subcaption_${i}`) || "").trim();
				return {
					filename: file.name,
					buffer: Buffer.from(await file.arrayBuffer()),
					subcaption,
				};
			})
		);

		await createGalleryModel({ caption, month, year, images });

		return new Response(
			JSON.stringify({ message: "Gallery collection created successfully" }),
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("createGallery error:", error);
		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to create gallery collection",
			}),
			{ status: 500 }
		);
	}
};
