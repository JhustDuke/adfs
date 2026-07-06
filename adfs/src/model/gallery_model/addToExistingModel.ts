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

/* ================= MAIN MODEL ================= */
export const addToExistingGalleryModel = async function (
	payload: AddToExistingGalleryPayload
): Promise<void> {
	const { collectionId, images } = payload;

	if (!images.length) {
		throw new Error("no images provided");
	}

	const conn = await appPool.getConnection();
	await conn.beginTransaction();

	//tracks fs side-effects so we can undo them if the db transaction rolls back
	const writtenFilePaths: string[] = [];

	try {
		const collectionCaption = await getCollectionCaption(conn, collectionId);

		//currentFolderId =1 or whatever
		const currentFolderId = String(collectionId);
		const currentFolderName = collectionCaption + "-images";

		//currentFolderPath=c://system32...images/galleryCollections/1/sports-images
		const currentFolderPath = path.join(
			uploadDir,
			currentFolderId,
			currentFolderName
		);
		ensureUploadDir(currentFolderPath);

		//relativeImagePath=images/galleryCollection/1/sports-images
		const relativeImagePath = `${imagePath}/${currentFolderId}/${currentFolderName}`;

		await validateNoFilenameCollisions(conn, collectionId, images);

		for (const image of images) {
			const filePath = await writeNewImage(
				conn,
				collectionId,
				currentFolderPath,
				relativeImagePath,
				image
			);
			writtenFilePaths.push(filePath);
		}

		await conn.commit();
	} catch (err: any) {
		await conn.rollback();
		await revertWrittenFiles(writtenFilePaths);

		throw new Error(err.message || "failed to add images to gallery");
	} finally {
		conn.release();
	}
};

/* ================= HELPERS ================= */

const getCollectionCaption = async function (conn: any, collectionId: number) {
	const [rows]: any = await conn.query(
		`SELECT id, caption FROM ${DBTableNames.galleryCollections}
		 WHERE id = ?`,
		[collectionId]
	);

	if (!rows.length) throw new Error("Gallery collection not found");

	return rows[0].caption;
};

const validateNoFilenameCollisions = async function (
	conn: any,
	collectionId: number,
	images: AddImagePayload[]
) {
	const existingImages = await getImagesForCollection(conn, collectionId);
	const existingFilenames = getFilenameSet(existingImages);

	for (const image of images) {
		if (existingFilenames.has(image.filename)) {
			throw new Error(
				`image "${image.filename}" already exists in this gallery`
			);
		}
	}
};

const getImagesForCollection = async function (
	conn: any,
	collectionId: number
) {
	const [rows]: any = await conn.query(
		`SELECT id, url
		 FROM ${DBTableNames.collectionImages}
		 WHERE collection_id = ?`,
		[collectionId]
	);
	return rows;
};

const getFilenameSet = function (images: any[]) {
	const filenames = new Set<string>();
	for (let img of images) {
		filenames.add(path.basename(img.url));
	}
	return filenames;
};

const writeNewImage = async function (
	conn: any,
	collectionId: number,
	folderPath: string,
	relativeImagePath: string,
	image: AddImagePayload
) {
	const filePath = path.join(folderPath, image.filename);
	await fs.promises.writeFile(filePath, image.buffer);

	const url = `${relativeImagePath}/${image.filename}`;

	await conn.query(
		`INSERT INTO ${DBTableNames.collectionImages} (collection_id, url, subcaption)
		 VALUES (?, ?, ?)`,
		[collectionId, url, image.subcaption ?? null]
	);

	return filePath;
};

const revertWrittenFiles = async function (filePaths: string[]) {
	for (const filePath of filePaths) {
		try {
			await fs.promises.unlink(filePath);
		} catch (err) {
			//if cleanup itself fails, log it — don't let it mask the original error
			console.error(`failed to revert file: ${filePath}`, err);
		}
	}
};
