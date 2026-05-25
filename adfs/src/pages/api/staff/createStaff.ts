export const prerender = false;

import type { APIRoute } from "astro";
import { createStaffModel } from "../../../model";

const allowedSize = 2 * 1024 * 1024; // 2MB
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const nameRegex = /^[a-zA-Z.\s'-]{2,100}$/;
const roleAllowed = ["proprietor", "director", "admin", "secretary", "staff"];

export const POST: APIRoute = async function ({ request }) {
	try {
		const formData: FormData = await request.formData();

		const name: string = String(formData.get("name") || "").trim();
		const role: string = String(formData.get("role") || "").trim();
		const image = formData.get("image") as File | null;

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

		// --- IMAGE ---
		if (!image) {
			throw new Error("Image is required");
		}
		if (!allowedMimeTypes.includes(image.type)) {
			throw new Error("Image must be a JPEG, PNG, or WebP file");
		}
		if (image.size > allowedSize) {
			throw new Error("Image size must not exceed 2MB");
		}

		const imageBuffer: Buffer = Buffer.from(await image.arrayBuffer());
		const imageOriginalName: string = image.name;

		await createStaffModel({
			name,
			role,
			imageBuffer,
			imageOriginalName,
		});

		return new Response(
			JSON.stringify({ message: "Staff created successfully" }),
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("createStaff error:", error);

		return new Response(
			JSON.stringify({
				message: error?.message || "Failed to create staff",
			}),
			{ status: 500 }
		);
	}
};
