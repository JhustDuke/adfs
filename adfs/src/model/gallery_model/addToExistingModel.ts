// addToExistingGalleryModel.ts
import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { ensureUploadDir, imageDir, DBTableNames } from "../../utils";

const imagePath = imageDir.galleryCollection;
const uploadDir: string = path.join(process.cwd(), imagePath);

interface AddImagePayload {
	filename: string;
	buffer: Buffer;
	subcaption?: string;
}

interface AddToExistingGalleryPayload {
	collectionId: number;
	images: AddImagePayload[];
}

export const addToExistingGalleryModel = async function (
	payload: AddToExistingGalleryPayload
): Promise<void> {
	const { collectionId, images } = payload;

	const conn = await appPool.getConnection();
	try {
		await conn.beginTransaction();

		// 1. Confirm collection exists and grab caption for folder path
		const [rows]: any = await conn.query(
			`SELECT id, caption FROM ${DBTableNames.galleryCollections}
       WHERE id = ?`,
			[collectionId]
		);
		if (!rows.length) throw new Error("Gallery collection not found");

		const caption: string = rows[0].caption;

		// 2. Build folder path from existing caption
		const collectionDir = path.join(uploadDir, caption);
		const imagesDir = path.join(collectionDir, `${caption}images`);
		ensureUploadDir(collectionDir);
		ensureUploadDir(imagesDir);

		// 3. Build incoming URLs and check for duplicates
		const incomingUrls = images.map((img) =>
			path.join(imagePath, caption, `${caption}-images`, img.filename)
		);

		const [existing]: any = await conn.query(
			`SELECT url FROM ${DBTableNames.collectionImages}
       WHERE url IN (?)`,
			[incomingUrls]
		);

		if (existing.length > 0) {
			const dupes = existing.map((row: any) => row.url).join(", ");
			throw new Error(`Image(s) already exist: ${dupes}`);
		}

		// 4. Write new files to disk
		for (const img of images) {
			const destPath = path.join(imagesDir, img.filename);
			await fs.promises.writeFile(destPath, img.buffer);
		}

		// 5. Batch insert new child rows
		const childRows = incomingUrls.map((url, i) => [
			collectionId,
			url,
			images[i].subcaption ?? "",
		]);

		await conn.query(
			`INSERT INTO ${DBTableNames.collectionImages} (collection_id, url, subcaption)
       VALUES ?`,
			[childRows]
		);

		await conn.commit();
	} catch (err) {
		await conn.rollback();
		throw err;
	} finally {
		conn.release();
	}
};
