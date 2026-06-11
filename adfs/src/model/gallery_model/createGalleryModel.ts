import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { ensureUploadDir, imageDir, DBTableNames } from "../../utils";

//ensureUploadDir takes a dir string makes sure it exist
//else throws an error

const imagePath = imageDir.galleryCollection;

const uploadDir: string = path.join(process.cwd(), imagePath);

interface ImagePayload {
	filename: string;
	buffer: Buffer;
	subcaption?: string;
}

interface CreateGalleryPayload {
	caption: string; // collection name / folder name
	month: string;
	year: number;
	images: ImagePayload[];
}

export const createGalleryModel = async function (
	payload: CreateGalleryPayload
): Promise<void> {
	const { caption, month, year, images } = payload;

	// 1. Build and ensure folder structure
	//    gallery/{caption}/{caption}images/
	const collectionDir = path.join(uploadDir, caption);
	const imagesDir = path.join(collectionDir, `${caption}-images`);
	ensureUploadDir(collectionDir);
	ensureUploadDir(imagesDir);
	let conn;
	try {
		conn = await appPool.getConnection();
		await conn.beginTransaction();

		// 2. Insert parent row
		const [parentResult]: any = await conn.query(
			`INSERT INTO ${DBTableNames.galleryCollections} (caption, month, year)
						VALUES (?, ?, ?)`,
			[caption, month, year]
		);
		const collectionId: number = parentResult.insertId;

		// 3. Build URLs and check for duplicates
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

		// 4. Write files to disk
		for (const img of images) {
			const destPath = path.join(imagesDir, img.filename);
			await fs.promises.writeFile(destPath, img.buffer);
		}

		// 5. Batch insert child rows
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
		await conn?.rollback();
		throw err;
	} finally {
		conn?.release();
	}
};

/**
 * this would create a folder first called galleryImages
 *  then create a sub folder based on the collection name,
 * store this collection_name to the db
 * gets the child table
 * checks if any new image already exist in that location,
 * else
 * links the url into it
 * since its unique if
 * any already pre exist
 * it stops all ops and say this image already exist in this collection
 * receives images payload
 * appends them inside the sub folder
 * makes sure and image doesnt exist twist
 *
 *
 */
