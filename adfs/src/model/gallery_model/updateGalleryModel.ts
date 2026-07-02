import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { ensureUploadDir, imageDir, DBTableNames } from "../../utils";

interface UpdateImagePayload {
	filename: string;
	buffer: Buffer;
	subcaption?: string;
}

interface UpdateGalleryPayload {
	collectionId: number;
	newCaption?: string;
	newMonth?: string;
	newYear?: number;
	newImages?: UpdateImagePayload[];
}

type GalleryFinalData = {
	updatedCaption: string;
	updatedMonth: string;
	updatedYear: string;
};
/**
 * what does updateGalleryModel do?
 * from update gallery  i can update
 * the gallery caption
 * change image caption
 * add new images to the gallery
 * ########################### n,
 *
 */

const uploadDir = path.join(process.cwd(), imageDir.galleryCollection);
/* ================= MAIN MODEL ================= */
export const updateGalleryModel = async function (
	payload: UpdateGalleryPayload
) {
	const { collectionId, newCaption, newImages, newMonth, newYear } = payload;

	const conn = await appPool.getConnection();

	/**
	 * if payload come in with a new caption...
	 * update the previous one from the db
	 * add the new one
	 * create a folder with the new name
	 * copy all urls from the previous into the new one
	 */
	try {
		const currentGalleryData = await getAllGalleryData(collectionId);

		const finalData: GalleryFinalData = {
			updatedCaption: newCaption ?? currentGalleryData.caption,
			updatedMonth: newMonth ?? currentGalleryData.month,
			updatedYear: newYear ?? currentGalleryData.year,
		};

		//if only newMonth or newYear is changed
		//update the db
		//do nothing else
		if (newMonth || newYear) {
			await updateGalleryData({ conn, collectionId, ...finalData });
			console.log("doing partial update");
		}

		//this would update the caption in the db
		//create a new  folder called 'updated' inside the prev caption name
		//copy all images into it
		//update the images db to point to this new directory

		const currentFolderName = currentGalleryData.caption;
		const currentFolderPath = path.join(uploadDir, currentFolderName);
		let newSubFolder: string | null = null;
		if (newCaption) {
			await updateGalleryData({ conn, collectionId, ...finalData });
			newSubFolder = createUpdatedSubFolderForCaption(currentFolderPath);
			console.log(newImages);
		}

		//if newImages is given, a
		//if the newSubFolder is not falsy
		//save it to updated folder in the directory after
		if (newImages) {
			if (newSubFolder !== null) {
			}
			//if new image has been uploaded
			//check the prev folder path if such and image exist
			//throw error if yes
			//store it in updated if no
			//update the images db
			//return
		}
	} catch (err: any) {
		throw new Error(err.message || "faied to update db");
	} finally {
		conn.release();
	}
};

const createUpdatedSubFolderForCaption = function (parentFolder: string) {
	ensureUploadDir(parentFolder);
	const finalPath = path.join(parentFolder, "updated");
	ensureUploadDir(finalPath);
	return finalPath;
};

const getAllGalleryData = async function (collectionId: number) {
	const conn = await appPool.getConnection();
	try {
		const [rows]: any = await conn.query(
			`SELECT id, caption, month, year
			 FROM ${DBTableNames.galleryCollections}
			 WHERE id = ?`,
			[collectionId]
		);

		if (!rows.length) throw new Error("Gallery not found");

		const data = rows[0];
		return {
			id: data.id,
			caption: data.caption,
			month: data.month,
			year: data.year,
		};
	} catch (err: any) {
		throw new Error(
			err.message || `couldnt find gallery with id:${collectionId}`
		);
	} finally {
		conn.release();
	}
};
type updateArgs = {
	conn: any;
	collectionId: number;
	updatedCaption: string;
	updatedMonth: string;
	updatedYear: string;
};
const updateGalleryData = async function (params: updateArgs) {
	const { collectionId, conn, updatedMonth, updatedYear, updatedCaption } =
		params;
	try {
		await conn.query(
			`UPDATE ${DBTableNames.galleryCollections}
		SET caption=?, month=?, year=?
		WHERE id=?
`,
			[updatedCaption, updatedMonth, updatedYear, collectionId]
		);
	} catch (err: any) {
		throw new Error(err || `failed to update gallery data for:${collectionId}`);
	}
};

// export const updateGalleryModel = async function (
// 	payload: UpdateGalleryPayload
// ): Promise<void> {
// 	const { collectionId, caption, month, year, images } = payload;

// 	const conn = await appPool.getConnection();

// 	try {

// 		if (captionChanged) {
// 			await updateCaption({
// 				conn,
// 				collectionId,
// 				current,
// 				finalCaption,
// 			});
// 		}

// 		if (hasImages && images) {
// 			await updateImages({
// 				conn,
// 				collectionId,
// 				finalCaption,
// 				images,
// 			});
// 		}

// 		await conn.commit();
// 	} catch (err) {
// 		await conn.rollback();
// 		throw err;
// 	} finally {
// 		conn.release();
// 	}
// };

// /* ================= HELPERS ================= */

// async function updateCaption(params: {
// 	conn: any;
// 	collectionId: number;
// 	current: any;
// 	finalCaption: string;
// }): Promise<void> {
// 	try {
// 		const { conn, collectionId, current, finalCaption } = params;

// 		const oldDir = path.join(uploadDir, current.caption);
// 		const updatedDir = path.join(oldDir, "updated");

// 		ensureUploadDir(updatedDir);

// 		const [images]: any = await conn.query(
// 			`SELECT id, url
// 			 FROM ${DBTableNames.collectionImages}
// 			 WHERE collection_id = ?`,
// 			[collectionId]
// 		);

// 		for (const row of images) {
// 			const oldFilePath = path.join(process.cwd(), row.url);
// 			const filename = path.basename(row.url);
// 			const newFilePath = path.join(updatedDir, filename);

// 			if (fs.existsSync(oldFilePath)) {
// 				await fs.promises.copyFile(oldFilePath, newFilePath);
// 				await fs.promises.unlink(oldFilePath);
// 			}

// 			const newUrl = path.join(imagePath, current.caption, "updated", filename);

// 			await conn.query(
// 				`UPDATE ${DBTableNames.collectionImages}
// 				 SET url = ?
// 				 WHERE id = ?`,
// 				[newUrl, row.id]
// 			);
// 		}
// 	} catch (err) {
// 		throw new Error(`[updateCaption] ${(err as Error).message}`);
// 	}
// }

// async function updateImages(params: {
// 	conn: any;
// 	collectionId: number;
// 	finalCaption: string;
// 	images: UpdateImagePayload[];
// }): Promise<void> {
// 	try {
// 		const { conn, collectionId, finalCaption, images } = params;

// 		const [existingImages]: any = await conn.query(
// 			`SELECT url
// 			 FROM ${DBTableNames.collectionImages}
// 			 WHERE collection_id = ?`,
// 			[collectionId]
// 		);

// 		await conn.query(
// 			`DELETE FROM ${DBTableNames.collectionImages}
// 			 WHERE collection_id = ?`,
// 			[collectionId]
// 		);

// 		const collectionDir = path.join(uploadDir, finalCaption);
// 		const imagesDir = path.join(collectionDir, `${finalCaption}-images`);

// 		ensureUploadDir(collectionDir);
// 		ensureUploadDir(imagesDir);

// 		for (const img of images) {
// 			const dest = path.join(imagesDir, img.filename);
// 			await fs.promises.writeFile(dest, img.buffer);
// 		}

// 		const rows = images.map((img) => [
// 			collectionId,
// 			path.join(
// 				imagePath,
// 				finalCaption,
// 				`${finalCaption}-images`,
// 				img.filename
// 			),
// 			img.subcaption ?? "",
// 		]);

// 		await conn.query(
// 			`INSERT INTO ${DBTableNames.collectionImages}
// 			 (collection_id, url, subcaption)
// 			 VALUES ?`,
// 			[rows]
// 		);

// 		for (const img of existingImages) {
// 			const filePath = path.join(process.cwd(), img.url);

// 			if (fs.existsSync(filePath)) {
// 				await fs.promises.unlink(filePath);
// 			}
// 		}
// 	} catch (err) {
// 		throw new Error(`[updateImages] ${(err as Error).message}`);
// 	}
// }

// async function deleteFolder(folderPath: string): Promise<void> {
// 	try {
// 		if (!fs.existsSync(folderPath)) return;

// 		const entries = await fs.promises.readdir(folderPath, {
// 			withFileTypes: true,
// 		});

// 		for (const entry of entries) {
// 			const entryPath = path.join(folderPath, entry.name);

// 			if (entry.isDirectory()) {
// 				await deleteFolder(entryPath);
// 				await fs.promises.rmdir(entryPath);
// 			} else {
// 				await fs.promises.unlink(entryPath);
// 			}
// 		}

// 		await fs.promises.rmdir(folderPath);
// 	} catch (err) {
// 		throw new Error(`[deleteFolder] ${(err as Error).message}`);
// 	}
// }
