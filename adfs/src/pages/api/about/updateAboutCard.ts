export const prerender = false;

import type { APIRoute } from "astro";
import { updateAboutCardModel } from "../../../model";

const allowedSize = 2 * 1024 * 1024; // 2MB

export const PATCH: APIRoute = async function ({ request }) {
	try {
		const formData: FormData = await request.formData();

		const id: number = Number(formData.get("id"));
		const caption: string = String(formData.get("title") || "").trim();
		const textContent: string = String(
			formData.get("textContent") || ""
		).trim();

		const image = formData.get("image") as File | null;

		if (!id) {
			throw new Error("ID is required");
		}

		if (!caption) {
			throw new Error("Caption is required");
		}

		if (!textContent) {
			throw new Error("Text content is required");
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

		await updateAboutCardModel({
			id,
			caption,
			textContent,
			imageBuffer,
			imageOriginalName,
		});

		return new Response(
			JSON.stringify({ message: "About card updated successfully" }),
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("PATCH about card error:", error);

		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to update about card",
			}),
			{ status: 500 }
		);
	}
};
