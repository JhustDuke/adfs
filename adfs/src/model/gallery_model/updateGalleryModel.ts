import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { ensureUploadDir, imageDir, DBTableNames } from "../../utils";

const imagePath = imageDir.galleryCollection;
const uploadDir: string = path.join(process.cwd(), imagePath);

interface UpdateImagePayload {
	filename: string;
	buffer: Buffer;
	subcaption?: string;
}

interface UpdateGalleryPayload {
	collectionId: number;
	caption?: string;
	month?: string;
	year?: number;
	images?: UpdateImagePayload[];
}

/* ================= MAIN MODEL ================= */
export const updateGalleryModel = async function (
	payload: UpdateGalleryPayload
): Promise<void> {
	const { collectionId, caption, month, year, images } = payload;

	const conn = await appPool.getConnection();

	try {
		await conn.beginTransaction();

		const [rows]: any = await conn.query(
			`SELECT id, caption, month, year
			 FROM ${DBTableNames.galleryCollections}
			 WHERE id = ?`,
			[collectionId]
		);

		if (!rows.length) throw new Error("Gallery not found");

		const current = rows[0];

		const finalCaption: string = caption ?? current.caption;
		const finalMonth: string = month ?? current.month;
		const finalYear: number = year ?? current.year;

		const captionChanged = finalCaption !== current.caption;
		const monthChanged = finalMonth !== current.month;
		const yearChanged = finalYear !== current.year;
		const hasImages = Boolean(images && images.length > 0);

		if (captionChanged || monthChanged || yearChanged) {
			await updateParent({
				conn,
				collectionId,
				finalCaption,
				finalMonth,
				finalYear,
			});
		}

		if (captionChanged) {
			await updateCaption({
				conn,
				collectionId,
				current,
				finalCaption,
			});
		}

		if (hasImages && images) {
			await updateImages({
				conn,
				collectionId,
				finalCaption,
				images,
			});
		}

		await conn.commit();
	} catch (err) {
		await conn.rollback();
		throw err;
	} finally {
		conn.release();
	}
};

/* ================= HELPERS ================= */

async function updateParent(params: {
	conn: any;
	collectionId: number;
	finalCaption: string;
	finalMonth: string;
	finalYear: number;
}): Promise<void> {
	try {
		const { conn, collectionId, finalCaption, finalMonth, finalYear } = params;

		await conn.query(
			`UPDATE ${DBTableNames.galleryCollections}
			 SET caption = ?, month = ?, year = ?
			 WHERE id = ?`,
			[finalCaption, finalMonth, finalYear, collectionId]
		);
	} catch (err) {
		throw new Error(`[updateParent] ${(err as Error).message}`);
	}
}

async function updateCaption(params: {
	conn: any;
	collectionId: number;
	current: any;
	finalCaption: string;
}): Promise<void> {
	try {
		const { conn, collectionId, current, finalCaption } = params;

		const oldDir = path.join(uploadDir, current.caption);
		const newDir = path.join(uploadDir, finalCaption);

		if (!fs.existsSync(oldDir)) return;

		await fs.promises.cp(oldDir, newDir, { recursive: true });

		const [images]: any = await conn.query(
			`SELECT id, url
			 FROM ${DBTableNames.collectionImages}
			 WHERE collection_id = ?`,
			[collectionId]
		);

		for (const row of images) {
			const newUrl = row.url.replace(
				`${imagePath}/${current.caption}`,
				`${imagePath}/${finalCaption}`
			);

			await conn.query(
				`UPDATE ${DBTableNames.collectionImages}
				 SET url = ?
				 WHERE id = ?`,
				[newUrl, row.id]
			);
		}

		await deleteFolder(oldDir);
	} catch (err) {
		throw new Error(`[updateCaption] ${(err as Error).message}`);
	}
}

async function updateImages(params: {
	conn: any;
	collectionId: number;
	finalCaption: string;
	images: UpdateImagePayload[];
}): Promise<void> {
	try {
		const { conn, collectionId, finalCaption, images } = params;

		const [existingImages]: any = await conn.query(
			`SELECT url
			 FROM ${DBTableNames.collectionImages}
			 WHERE collection_id = ?`,
			[collectionId]
		);

		await conn.query(
			`DELETE FROM ${DBTableNames.collectionImages}
			 WHERE collection_id = ?`,
			[collectionId]
		);

		const collectionDir = path.join(uploadDir, finalCaption);
		const imagesDir = path.join(collectionDir, `${finalCaption}-images`);

		ensureUploadDir(collectionDir);
		ensureUploadDir(imagesDir);

		for (const img of images) {
			const dest = path.join(imagesDir, img.filename);
			await fs.promises.writeFile(dest, img.buffer);
		}

		const rows = images.map((img) => [
			collectionId,
			path.join(
				imagePath,
				finalCaption,
				`${finalCaption}-images`,
				img.filename
			),
			img.subcaption ?? "",
		]);

		await conn.query(
			`INSERT INTO ${DBTableNames.collectionImages}
			 (collection_id, url, subcaption)
			 VALUES ?`,
			[rows]
		);

		for (const img of existingImages) {
			const filePath = path.join(process.cwd(), img.url);

			if (fs.existsSync(filePath)) {
				await fs.promises.unlink(filePath);
			}
		}
	} catch (err) {
		throw new Error(`[updateImages] ${(err as Error).message}`);
	}
}

async function deleteFolder(folderPath: string): Promise<void> {
	try {
		if (!fs.existsSync(folderPath)) return;

		const entries = await fs.promises.readdir(folderPath, {
			withFileTypes: true,
		});

		for (const entry of entries) {
			const entryPath = path.join(folderPath, entry.name);

			if (entry.isDirectory()) {
				await deleteFolder(entryPath);
				await fs.promises.rmdir(entryPath);
			} else {
				await fs.promises.unlink(entryPath);
			}
		}

		await fs.promises.rmdir(folderPath);
	} catch (err) {
		throw new Error(`[deleteFolder] ${(err as Error).message}`);
	}
}
