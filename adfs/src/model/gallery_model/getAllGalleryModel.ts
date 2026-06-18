import { appPool } from "../config";
import { DBTableNames } from "../../utils";

export interface AllGalleryData {
	galleryDB_id: number;
	caption: string;
	month: string;
	year: number;
	date: string;
	images: { url: string; subCaption: string }[];
}

/**
 * Fetch all galleries with images (JS hydrated)
 * DB returns flat rows, JS builds structure
 */
export const getAllGalleryModel = async function (): Promise<AllGalleryData[]> {
	const conn = await appPool.getConnection();

	try {
		// 1. FLAT QUERY ONLY (no JSON aggregation)
		const [rows]: any = await conn.query(
			`SELECT
				gallery.id AS galleryDB_id,
				gallery.caption AS caption,
				gallery.month AS month,
				gallery.year AS year,
				CONCAT(gallery.month, ' ', gallery.year) AS date,
				image.url AS url,
				image.subcaption AS subcaption
			FROM ${DBTableNames.galleryCollections} AS gallery
			LEFT JOIN ${DBTableNames.collectionImages} AS image
				ON image.collection_id = gallery.id
			ORDER BY gallery.year DESC,
				FIELD(gallery.month,
					'December','November','October','September',
					'August','July','June','May',
					'April','March','February','January'
				),
				gallery.id`
		);

		// 2. HYDRATION (build nested structure)
		const galleryMap = new Map<number, AllGalleryData>();

		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];
			const id = row.galleryDB_id;

			// create gallery entry if not exists
			if (!galleryMap.has(id)) {
				galleryMap.set(id, {
					galleryDB_id: id,
					caption: row.caption,
					month: row.month,
					year: row.year,
					date: row.date,
					images: [],
				});
			}

			// attach image if exists
			if (row.url) {
				const gallery = galleryMap.get(id);

				// safety check (should never fail)
				if (gallery) {
					gallery.images.push({
						url: row.url,
						subCaption: row.subcaption,
					});
				}
			}
		}

		// 3. RETURN FINAL STRUCTURE
		return Array.from(galleryMap.values());
	} finally {
		conn.release();
	}
};
