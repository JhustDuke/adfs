export const prerender = false;

import type { APIRoute } from "astro";
import { createAcademicPageModel } from "../../../model";

const allowedSize = 2 * 1024 * 1024; // 2MB

export const POST: APIRoute = async function ({ request }) {
	try {
		const formData: FormData = await request.formData();

		const caption: string = String(formData.get("caption") || "").trim();

		const excerpts: string = String(formData.get("excerpts") || "").trim();
		const image = formData.get("image") as File | null;
		const textCaptionColor: string = String(
			formData.get("textCaptionColor") || "black"
		).trim();

		const bgColor: string = String(formData.get("bgColor") || "").trim();
		if (!caption) {
			throw new Error("Caption is required");
		}

		if (!excerpts) {
			throw new Error("Excerpts is required");
		}

		if (!image) {
			throw new Error("Image is required");
		}

		if (image.size > allowedSize) {
			throw new Error("Image size must not exceed 2MB");
		}

		const imageBuffer: Buffer = Buffer.from(await image.arrayBuffer());
		const imageOriginalName: string = image.name;

		await createAcademicPageModel({
			caption,
			excerpts,
			imageBuffer,
			imageOriginalName,
			textCaptionColor,
			bgColor,
		});

		return new Response(
			JSON.stringify({ message: "Academic page item created successfully" }),
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("createAcademicPage error:", error);

		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to create academic page item",
			}),
			{ status: 500 }
		);
	}
};
