export const prerender = false;
import type { APIRoute } from "astro";
import { createNewsModel } from "../../../model";

export const POST: APIRoute = async function ({ request }) {
	try {
		const body = await request.json();

		const title: string = String(body.title || "").trim();
		const date: string = String(body.date || "").trim();
		const excerpt: string = String(body.excerpt || "").trim();
		const fullText: string = String(body.fullText || "").trim();
		const category: string = String(body.category || "").trim();

		if (!title || !date || !excerpt || !fullText || !category) {
			console.log("validation failed before returning");
			return new Response(
				JSON.stringify({ error: "All fields are required" }),
				{ status: 400 }
			);
		}

		await createNewsModel(title, date, excerpt, fullText, category);

		return new Response(
			JSON.stringify({ message: "News created successfully" }),
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("createNews error:", error);

		return new Response(
			JSON.stringify({
				error: error?.message || "Failed to create news",
			}),
			{ status: 500 }
		);
	}
};
