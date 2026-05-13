export const prerender = false;

import type { APIRoute } from "astro";

import { updateAcademicPageModel } from "../../../model";

const allowedSize = 2 * 1024 * 1024; // 2MB

export const PATCH: APIRoute = async function ({ request }) {
	try {
		const formData: FormData = await request.formData();

		const id: number = Number(formData.get("id"));

		const caption: string = String(formData.get("caption") || "").trim();

		const excerpts: string = String(formData.get("excerpts") || "").trim();

		const textCaptionColor: string = String(
			formData.get("textCaptionColor") || ""
		).trim();

		const bgColor: string = String(formData.get("bgColor") || "").trim();

		const image = formData.get("image") as File | null;

		if (!id) {
			throw new Error("ID is required");
		}

		if (!caption) {
			throw new Error("Caption is required");
		}

		if (!excerpts) {
			throw new Error("Excerpts is required");
		}

		let imageBuffer: Buffer | undefined;

		let imageOriginalName: string | undefined;

		// optional image handling
		if (image) {
			if (image.size > allowedSize) {
				throw new Error("Image size must not exceed 2MB");
			}

			imageBuffer = Buffer.from(await image.arrayBuffer());

			imageOriginalName = image.name;
		}

		await updateAcademicPageModel({
			id,
			caption,
			excerpts,
			textCaptionColor,
			bgColor,
			imageBuffer,
			imageOriginalName,
		});

		return new Response(
			JSON.stringify({
				message: "Academic page updated successfully",
			}),
			{
				status: 200,
			}
		);
	} catch (error: any) {
		console.error("PATCH academic page error:", error);

		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to update academic page",
			}),
			{
				status: 500,
			}
		);
	}
};
