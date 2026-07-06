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

type CleanupTask = () => Promise<void>;

const uploadDir = path.join(process.cwd(), imageDir.galleryCollection);

/* ================= MAIN MODEL ================= */
export const updateGalleryModel = async function (
	payload: UpdateGalleryPayload
) {
	const { collectionId, newCaption, newImages, newMonth, newYear } = payload;

	const conn = await appPool.getConnection();
	await conn.beginTransaction();

	//tracks fs side-effects so we can undo them if the db transaction rolls back
	const cleanupTasks: CleanupTask[] = [];

	try {
		const currentGalleryData = await getAllGalleryData(collectionId);

		const finalData: GalleryFinalData = {
			updatedCaption: newCaption ?? currentGalleryData.caption,
			updatedMonth: newMonth ?? currentGalleryData.month,
			updatedYear: newYear ?? currentGalleryData.year,
		};

		//currentFolderId =1 or whatever
		const currentFolderId = String(currentGalleryData.id);
		const currentFolderName = currentGalleryData.caption + "-images";

		//this stays pointed at the FINAL folder for this collection,
		//whether or not newCaption was given (used below for newImages too)
		let activeFolderName = currentFolderName;

		if (newCaption) {
			activeFolderName = await handleCaptionRename({
				conn,
				collectionId,
				currentFolderId,
				currentFolderName,
				newCaption,
				cleanupTasks,
			});
		}

		if (newMonth || newYear || newCaption) {
			await updateGalleryData({ conn, collectionId, ...finalData });
		}

		if (newImages && newImages.length) {
			await handleNewImages({
				conn,
				collectionId,
				currentFolderId,
				activeFolderName,
				newImages,
				cleanupTasks,
			});
		}

		await conn.commit();
	} catch (err: any) {
		await conn.rollback();
		await runCleanupTasks(cleanupTasks);

		throw new Error(err.message || "faied to update db");
	} finally {
		conn.release();
	}
};

/* ================= CAPTION RENAME ================= */

const handleCaptionRename = async function (params: {
	conn: any;
	collectionId: number;
	currentFolderId: string;
	currentFolderName: string;
	newCaption: string;
	cleanupTasks: CleanupTask[];
}) {
	const {
		conn,
		collectionId,
		currentFolderId,
		currentFolderName,
		newCaption,
		cleanupTasks,
	} = params;

	const newFolderName = newCaption + "-images";

	//relativeImagePath=images/galleryCollection/1/newFolderName
	const relativeImagePath = `${imageDir.galleryCollection}/${currentFolderId}/${newFolderName}`;

	//currentFolderPath=c://system32...images/galleryCollections/1/sports-images
	const currentFolderPath = path.join(
		uploadDir,
		currentFolderId,
		currentFolderName
	);
	const newFolderPath = path.join(uploadDir, currentFolderId, newFolderName);

	//rename the folder first
	await validateAndRenameFolder(currentFolderPath, newFolderPath);

	cleanupTasks.push(async function () {
		await revertFolderRename(newFolderPath, currentFolderPath);
	});

	const newImageUrls = await updateImageUrl(newFolderPath, relativeImagePath);
	await updateImageUrlsInDb(conn, collectionId, newImageUrls);

	return newFolderName;
};

/* ================= FOLDER / URL HELPERS ================= */

const validateAndRenameFolder = async function (
	oldFolderPath: string,
	newFolderPath: string
) {
	if (!fs.existsSync(oldFolderPath)) {
		throw new Error("gallery not found");
	}

	await fs.promises.rename(oldFolderPath, newFolderPath);
};

const revertFolderRename = async function (
	currentPath: string,
	originalPath: string
) {
	try {
		if (fs.existsSync(currentPath)) {
			await fs.promises.rename(currentPath, originalPath);
		}
	} catch (err) {
		//if the revert itself fails, log it — don't mask the original error
		console.error(
			`failed to revert folder rename: ${currentPath} -> ${originalPath}`,
			err
		);
	}
};

const updateImageUrl = async function (
	newFolderPath: string,
	relativeImagePath: string
) {
	const finalUrl: string[] = [];

	//what do i want
	//go into each image,e.g image1.jpg
	//change it to images/galleryCollections/1/renamed-folder/image1.jpg
	//push it to final
	const images = await fs.promises.readdir(newFolderPath);
	for (let image of images) {
		finalUrl.push(`${relativeImagePath}/${image}`);
	}
	return finalUrl;
};

/**
 * matches each new url to its existing row by filename (the one thing
 * that doesn't change on a rename), then updates that specific row by id
 * so no two images can ever collide/overwrite each other
 */
const updateImageUrlsInDb = async function (
	conn: any,
	collectionId: number,
	newUrls: string[]
) {
	try {
		const existingImages = await getImagesForCollection(conn, collectionId);

		for (const newUrl of newUrls) {
			await updateSingleImageUrl(conn, existingImages, newUrl);
		}
	} catch (err: any) {
		throw new Error(
			err.message ||
				`failed to update image urls for collection:${collectionId}`
		);
	}
};

const updateSingleImageUrl = async function (
	conn: any,
	existingImages: any[],
	newUrl: string
) {
	const filename = path.basename(newUrl);
	const match = findImageByFilename(existingImages, filename);

	if (!match) return; //no matching db row for this file, skip

	await conn.query(
		`UPDATE ${DBTableNames.collectionImages}
		 SET url = ?
		 WHERE id = ?`,
		[newUrl, match.id]
	);
};

const findImageByFilename = function (existingImages: any[], filename: string) {
	for (let img of existingImages) {
		if (path.basename(img.url) === filename) return img;
	}
	return null;
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

/* ================= NEW IMAGES ================= */

const handleNewImages = async function (params: {
	conn: any;
	collectionId: number;
	currentFolderId: string;
	activeFolderName: string;
	newImages: UpdateImagePayload[];
	cleanupTasks: CleanupTask[];
}) {
	const {
		conn,
		collectionId,
		currentFolderId,
		activeFolderName,
		newImages,
		cleanupTasks,
	} = params;

	//activeFolderPath=c://system32...images/galleryCollections/1/activeFolderName
	const activeFolderPath = path.join(
		uploadDir,
		currentFolderId,
		activeFolderName
	);
	const relativeImagePath = `${imageDir.galleryCollection}/${currentFolderId}/${activeFolderName}`;

	const writtenFilePaths = await addNewImages(
		conn,
		collectionId,
		activeFolderPath,
		relativeImagePath,
		newImages
	);

	cleanupTasks.push(async function () {
		await revertWrittenFiles(writtenFilePaths);
	});
};

const addNewImages = async function (
	conn: any,
	collectionId: number,
	folderPath: string,
	relativeImagePath: string,
	newImages: UpdateImagePayload[]
) {
	if (!fs.existsSync(folderPath)) {
		throw new Error("gallery folder not found");
	}

	await validateNoFilenameCollisions(conn, collectionId, newImages);

	const writtenFilePaths: string[] = [];

	for (const image of newImages) {
		const filePath = await writeNewImage(
			conn,
			collectionId,
			folderPath,
			relativeImagePath,
			image
		);
		writtenFilePaths.push(filePath);
	}

	return writtenFilePaths;
};

const validateNoFilenameCollisions = async function (
	conn: any,
	collectionId: number,
	newImages: UpdateImagePayload[]
) {
	const existingImages = await getImagesForCollection(conn, collectionId);
	const existingFilenames = getFilenameSet(existingImages);

	for (const image of newImages) {
		if (existingFilenames.has(image.filename)) {
			throw new Error(
				`image "${image.filename}" already exists in this gallery`
			);
		}
	}
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
	image: UpdateImagePayload
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

const runCleanupTasks = async function (cleanupTasks: CleanupTask[]) {
	//undo fs changes in reverse order, since db already rolled back
	const reversedTasks = cleanupTasks.reverse();
	for (const cleanup of reversedTasks) {
		await cleanup();
	}
};

/* ================= GALLERY DB HELPERS ================= */

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
			 WHERE id=?`,
			[updatedCaption, updatedMonth, updatedYear, collectionId]
		);
	} catch (err: any) {
		throw new Error(
			err.message || `failed to update gallery data for:${collectionId}`
		);
	}
};
