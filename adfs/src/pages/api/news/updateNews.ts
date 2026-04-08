export const prerender = false;

import type { APIRoute } from "astro";
import { updateNewsModel } from "../../../model";
validateFields;

import { validateFields } from "../../../utils";

const requiredFields: string[] = [
	"initialTitle",
	"date",
	"excerpt",
	"fullText",
	"category",
];

export const PATCH: APIRoute = async function ({ request }) {
	try {
		const body = await request.json();

		if (body.updatedTitle) {
			requiredFields.push("updatedTitle");

			const data = validateFields(body, requiredFields);

			await updateNewsModel(data as any);

			requiredFields.pop();
		} else {
			const data = validateFields(body, requiredFields);

			await updateNewsModel(data as any);
		}

		return new Response(
			JSON.stringify({ message: "News updated successfully" }),
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("updateNews error:", error);

		return new Response(
			JSON.stringify({
				error: error?.message || "Failed to update news",
			}),
			{ status: 500 }
		);
	}
};
