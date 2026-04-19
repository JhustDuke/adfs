export const prerender = false;

import type { APIRoute } from "astro";
import { getAllAboutCardsModel } from "../../../model";

export const GET: APIRoute = async function () {
	try {
		const cards = await getAllAboutCardsModel();

		if (!cards || cards.length === 0) {
			console.log("no about cards found"); // early return log
			return new Response(
				JSON.stringify({
					message: "No about cards found",
					data: [],
				}),
				{ status: 200 }
			);
		}

		return new Response(
			JSON.stringify({
				message: "About cards fetched successfully",
				data: cards,
			}),
			{ status: 200 }
		);
	} catch (error: unknown) {
		const err = error as Error;

		console.error("getAllAboutCards error:", err);

		return new Response(
			JSON.stringify({
				message: err.message || "Failed to fetch about cards",
			}),
			{ status: 500 }
		);
	}
};
