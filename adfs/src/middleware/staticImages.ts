// src/middleware/staticImages.ts
import fs from "fs";
import path from "path";
import { defineMiddleware } from "astro:middleware";

// Map of file extensions to their correct Content-Type header.
// Without this, the browser won't know how to render the response as an image.
const MIME_TYPES: Record<string, string> = {
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".webp": "image/webp",
	".gif": "image/gif",
};

export const staticImagesMiddleware = defineMiddleware(async function (
	{ url },
	next
) {
	// Only handle requests under /images/, let everything else pass through
	if (!url.pathname.startsWith("/images/")) {
		return next();
	}

	// Browsers URL-encode special characters in paths (e.g. spaces become %20).
	// Example: "Screenshot (61).png" becomes "Screenshot%20(61).png" in the URL.
	// The filesystem doesn't know about this encoding, so without decoding,
	// fs.existsSync() looks for a file that literally has "%20" in its name
	// and fails to find it — causing a false 404 even though the file exists.
	const decodedPath = decodeURIComponent(url.pathname);

	// Resolve the decoded URL path to an actual file location on disk.
	// process.cwd() is the project root when running the built server.
	const filePath = path.join(process.cwd(), decodedPath);

	// Confirm the path exists AND is a file (not a folder) before reading it
	if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
		const ext = path.extname(filePath).toLowerCase();
		const contentType = MIME_TYPES[ext] || "application/octet-stream";
		const file = await fs.promises.readFile(filePath);

		return new Response(file, {
			status: 200,
			headers: { "Content-Type": contentType },
		});
	}

	// File genuinely doesn't exist on disk
	return new Response("Not found", { status: 404 });
});
