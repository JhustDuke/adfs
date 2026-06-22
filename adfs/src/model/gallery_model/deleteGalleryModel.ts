import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { imageDir, DBTableNames } from "../../utils";

const imagePath = imageDir.galleryCollection;
const uploadDir: string = path.join(process.cwd(), imagePath);

/* ================= DELETE ENTIRE GALLERY ================= */
export const deleteGalleryModel = async function (
	collectionId: number
): Promise<void> {
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

		// 2. Grab all image URLs before deleting rows
		const [images]: any = await conn.query(
			`SELECT url FROM ${DBTableNames.collectionImages}
			 WHERE collection_id = ?`,
			[collectionId]
		);

		// 3. Delete child rows
		await conn.query(
			`DELETE FROM ${DBTableNames.collectionImages}
			 WHERE collection_id = ?`,
			[collectionId]
		);

		// 4. Delete parent row
		await conn.query(
			`DELETE FROM ${DBTableNames.galleryCollections}
			 WHERE id = ?`,
			[collectionId]
		);

		// 5. Delete image files individually, leave folders alone
		for (const img of images) {
			const filePath = path.join(process.cwd(), img.url);
			if (fs.existsSync(filePath)) {
				await fs.promises.unlink(filePath);
			}
		}

		await conn.commit();
	} catch (err) {
		await conn.rollback();
		throw err;
	} finally {
		conn.release();
	}
};

/* ================= DELETE SINGLE IMAGE ================= */
export const deleteGalleryImageModel = async function (
	collectionId: number,
	imageUrl: string
): Promise<void> {
	const conn = await appPool.getConnection();

	try {
		await conn.beginTransaction();

		// 1. Confirm image exists in this collection
		const [rows]: any = await conn.query(
			`SELECT id FROM ${DBTableNames.collectionImages}
			 WHERE collection_id = ? AND url = ?`,
			[collectionId, imageUrl]
		);

		if (!rows.length) throw new Error("Image not found in this collection");

		// 2. Delete DB row
		await conn.query(
			`DELETE FROM ${DBTableNames.collectionImages}
			 WHERE collection_id = ? AND url = ?`,
			[collectionId, imageUrl]
		);

		// 3. Delete file from disk
		const fullPath = path.join(process.cwd(), imageUrl);
		if (fs.existsSync(fullPath)) {
			await fs.promises.unlink(fullPath);
		}

		await conn.commit();
	} catch (err) {
		await conn.rollback();
		throw err;
	} finally {
		conn.release();
	}
};
