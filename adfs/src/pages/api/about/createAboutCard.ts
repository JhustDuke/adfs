export const prerender = false;

import type { APIRoute } from "astro";
import { createAboutCardModel } from "../../../model";

const allowedSize = 2 * 1024 * 1024; // 2MB

export const POST: APIRoute = async function ({ request }) {
	try {
		const formData: FormData = await request.formData();

		const caption: string = String(formData.get("caption") || "").trim();
		const textContent: string = String(
			formData.get("textContent") || ""
		).trim();
		const image = formData.get("image") as File | null;

		if (!caption) {
			throw new Error("Caption is required");
		}

		if (!textContent) {
			throw new Error("Text content is required");
		}

		if (!image) {
			throw new Error("Image is required");
		}

		if (image.size > allowedSize) {
			throw new Error("Image size must not exceed 2MB");
		}

		const imageBuffer: Buffer = Buffer.from(await image.arrayBuffer());
		const imageOriginalName: string = image.name;

		await createAboutCardModel({
			caption,
			textContent,
			imageBuffer,
			imageOriginalName,
		});

		return new Response(
			JSON.stringify({ message: "About card created successfully" }),
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("createAboutCard error:", error);

		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to create about card",
			}),
			{ status: 500 }
		);
	}
};
