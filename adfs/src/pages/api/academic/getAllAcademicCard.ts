export const prerender = false;

import type { APIRoute } from "astro";
import { getAllAcademicCardsModel } from "../../../model";

export const GET: APIRoute = async function () {
	try {
		const cards = await getAllAcademicCardsModel();

		if (!cards || cards.length === 0) {
			console.log("no academic cards found"); // early return log
			return new Response(
				JSON.stringify({
					message: "No academic cards found",
					data: [],
				}),
				{ status: 200 }
			);
		}

		return new Response(
			JSON.stringify({
				message: "Academic cards fetched successfully",
				data: cards,
			}),
			{ status: 200 }
		);
	} catch (error: unknown) {
		const err = error as Error;

		console.error("getAllAcademicCards error:", err);

		return new Response(
			JSON.stringify({
				message: err.message || "Failed to fetch about cards",
			}),
			{ status: 500 }
		);
	}
};
