export const prerender = false;

import type { APIRoute } from "astro";
import { updateStaffModel } from "../../../model";

const allowedSize = 2 * 1024 * 1024; // 2MB
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const nameRegex = /^[a-zA-Z.\s'-]{2,100}$/;
const roleAllowed = ["proprietor", "director", "admin", "secretary", "staff"];

export const PATCH: APIRoute = async function ({ request }) {
	try {
		const formData: FormData = await request.formData();

		const id: number = Number(formData.get("id"));
		const name: string = String(formData.get("name") || "").trim();
		const role: string = String(formData.get("role") || "").trim();
		const image = formData.get("image") as File | null;

		// --- ID ---
		if (!id || isNaN(id)) {
			throw new Error("Valid staff ID is required");
		}

		// --- NAME ---
		if (!name) {
			throw new Error("Name is required");
		}
		if (!nameRegex.test(name)) {
			throw new Error(
				"Name must be 2-100 characters and contain only letters, spaces, hyphens, or apostrophes"
			);
		}

		// --- ROLE ---
		if (!role) {
			throw new Error("Role is required");
		}
		if (!roleAllowed.includes(role)) {
			throw new Error("Invalid role provided");
		}

		// --- IMAGE (optional) ---
		if (image && image.size > 0) {
			if (!allowedMimeTypes.includes(image.type)) {
				throw new Error("Image must be a JPEG, PNG, or WebP file");
			}
			if (image.size > allowedSize) {
				throw new Error("Image size must not exceed 2MB");
			}

			const imageBuffer: Buffer = Buffer.from(await image.arrayBuffer());
			const imageOriginalName: string = image.name;

			await updateStaffModel({
				id,
				name,
				role,
				imageBuffer,
				imageOriginalName,
			});
		} else {
			await updateStaffModel({
				id,
				name,
				role,
			});
		}

		return new Response(
			JSON.stringify({ message: "Staff updated successfully" }),
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("updateStaff error:", error);

		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to update staff",
			}),
			{ status: 500 }
		);
	}
};
