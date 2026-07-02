import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { ensureUploadDir, imageDir, DBTableNames } from "../../utils";
import type { ResultSetHeader, PoolConnection } from "mysql2/promise";

const imagePath = imageDir.galleryCollection;
const absolutePath: string = path.join(process.cwd(), imagePath);

interface ImagePayload {
	filename: string;
	buffer: Buffer;
	subcaption?: string;
}

interface CreateGalleryPayload {
	caption: string; // collection name used as subfolder inside the collectionId folder
	month: string;
	year: number;
	images: ImagePayload[];
}

export const createGalleryModel = async function (
	payload: CreateGalleryPayload
): Promise<void> {
	const { caption, month, year, images } = payload;
	let conn;
	// hoisted outside try so catch can access it for folder cleanup on failure
	let collectionDir: string | undefined;
	try {
		conn = await appPool.getConnection();
		await conn.beginTransaction();

		// insert the parent collection row first to get the auto-incremented collectionId
		// collectionId is used as the top-level folder name on disk — it never changes
		// unlike caption which can be renamed, keeping disk and DB always in sync
		const collectionId = await insertIntoDB(conn, { caption, month, year });

		// folder structure on disk:
		// absolutePath/{collectionId}/{caption}-images/
		// example: images/galleryCollections/1/summerEvent-images/
		collectionDir = path.join(absolutePath, String(collectionId));
		const imagesDir = path.join(collectionDir, `${caption}-images`);
		ensureUploadDir(collectionDir);
		ensureUploadDir(imagesDir);

		// build relative URLs for storing in DB
		// these are relative to the project root, not absolute server paths
		// example: images/galleryCollections/1/summerEvent-images/photo.jpg
		const incomingUrls = buildImagesUrl(collectionId, caption, images);

		// guard against duplicate image URLs already existing in the DB
		// throws early before any files are written to disk
		await checkDuplicateUrlInDb(conn, incomingUrls);

		// write image buffers to disk inside the caption-images subfolder
		await writeFilesToDisk(imagesDir, images);

		// batch insert all image rows into collection_images table
		// links each image URL and optional subcaption to the parent collectionId
		await insertImageRows(conn, collectionId, incomingUrls, images);

		await conn.commit();
	} catch (err) {
		// roll back DB changes first
		await conn?.rollback();
		// if folders were created before the failure, remove them from disk
		// prevents orphaned folders when the DB transaction fails
		if (collectionDir) await revertFolderCreation(collectionDir);
		throw err;
	} finally {
		conn?.release();
	}
};

/* ================= HELPERS ================= */

// recursively deletes a folder and all its contents
// used to clean up disk when a DB transaction fails mid-way
// the extra readdir call before rmdir is intentional —
// it forces Node to wait for the OS to release file handles
// before attempting to delete the now-empty folder (prevents ENOTEMPTY on Windows)
const revertFolderCreation = async function (
	createdPath: string
): Promise<void> {
	try {
		const entries = await fs.promises.readdir(createdPath, {
			withFileTypes: true,
		});
		for (const entry of entries) {
			const entryPath = path.join(createdPath, entry.name);
			if (entry.isDirectory()) {
				// recurse into subfolders before deleting them
				await revertFolderCreation(entryPath);
			} else {
				await fs.promises.unlink(entryPath);
			}
		}
		// readdir hack: forces OS handle release before rmdir runs
		await fs.promises.readdir(createdPath);
		await fs.promises.rmdir(createdPath);
	} catch (err: any) {
		throw new Error(err.message || "failed to revert folder creation");
	}
};

type dbInsertDataStruc = {
	caption: string;
	month: string;
	year: number;
};

// inserts the parent gallery collection row and returns the auto-incremented id
// the id is used immediately after to name the folder on disk
const insertIntoDB = async function (
	conn: any,
	{ caption, month, year }: dbInsertDataStruc
): Promise<number> {
	try {
		const [result] = (await conn.query(
			`INSERT INTO ${DBTableNames.galleryCollections} (caption, month, year) VALUES (?, ?, ?)`,
			[caption, month, year]
		)) as [ResultSetHeader];
		return result.insertId;
	} catch (err: any) {
		throw new Error(err.message || "failed to insert records");
	}
};

// builds relative image URLs for DB storage
// format: imagePath/{collectionId}/{caption}-images/{filename}
// relative paths are used so URLs stay valid regardless of where the server runs
const buildImagesUrl = function (
	collectionId: number,
	caption: string,
	images: ImagePayload[]
): string[] {
	return images.map((img) =>
		path.join(
			imagePath,
			String(collectionId),
			`${caption}-images`,
			img.filename
		)
	);
};

// checks if any incoming image URL already exists in the DB
// throws before any disk writes happen to keep DB and disk in sync
const checkDuplicateUrlInDb = async function (
	conn: PoolConnection,
	imagesUrl: string[]
): Promise<void> {
	const [existing]: any = await conn.query(
		`SELECT url FROM ${DBTableNames.collectionImages} WHERE url IN (?)`,
		[imagesUrl]
	);
	if (existing.length > 0) {
		const dupes = existing.map((row: any) => row.url).join(", ");
		throw new Error(`Image(s) already exist: ${dupes}`);
	}
};

// writes image buffers to disk inside the caption-images subfolder
const writeFilesToDisk = async function (
	imagesDir: string,
	images: ImagePayload[]
): Promise<void> {
	for (const img of images) {
		const destPath = path.join(imagesDir, img.filename);
		await fs.promises.writeFile(destPath, img.buffer);
	}
};

// batch inserts all image rows into collection_images
// each row links a relative URL and optional subcaption to the parent collectionId
const insertImageRows = async function (
	conn: PoolConnection,
	collectionId: number,
	incomingUrls: string[],
	images: ImagePayload[]
): Promise<void> {
	const childRows = incomingUrls.map(function (url, i) {
		return [collectionId, url, images[i].subcaption ?? ""];
	});
	await conn.query(
		`INSERT INTO ${DBTableNames.collectionImages} (collection_id, url, subcaption) VALUES ?`,
		[childRows]
	);
};
