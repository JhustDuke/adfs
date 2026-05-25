export const prerender = false;

import type { APIRoute } from "astro";
import { deleteStaffModel } from "../../../model";

export const DELETE: APIRoute = async function ({ request }) {
	try {
		const body = await request.json();
		const id: number = Number(body?.id);

		// --- ID ---
		if (!id || isNaN(id)) {
			throw new Error("Valid staff ID is required");
		}

		await deleteStaffModel(id);

		return new Response(
			JSON.stringify({ message: "Staff deleted successfully" }),
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("deleteStaff error:", error);

		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to delete staff",
			}),
			{ status: 500 }
		);
	}
};
