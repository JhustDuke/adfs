import { appPool } from "../config";
import { DBTableNames } from "../../utils";
import type { UpdateNewsPayload } from "../../interfaces/updateNewsPayloadInterface";

export const updateNewsModel = async function (
	payload: UpdateNewsPayload
): Promise<void> {
	let connection;

	try {
		connection = await appPool.getConnection();

		let result: any;

		if (payload.updatedTitle) {
			[result] = await connection.query(
				`
				UPDATE ${DBTableNames.newsTable}
				SET title = ?, date = ?, excerpt = ?, full_text = ?, category = ?
				WHERE title = ?
				`,
				[
					payload.updatedTitle,
					payload.date,
					payload.excerpt,
					payload.fullText,
					payload.category,
					payload.initialTitle,
				]
			);
		} else {
			[result] = await connection.query(
				`
				UPDATE ${DBTableNames.newsTable}
				SET date = ?, excerpt = ?, full_text = ?, category = ?
				WHERE title = ?
				`,
				[
					payload.date,
					payload.excerpt,
					payload.fullText,
					payload.category,
					payload.initialTitle,
				]
			);
		}

		if (!result) {
			console.log("early return: no matching row");
			throw new Error("no match found");
		}

		if (result.affectedRows === 0) {
			throw new Error(
				`couldn't find a news with title; ${payload.initialTitle}`
			);
		}

		if (result.affectedRows > 1) {
			throw new Error("Data integrity issue: multiple rows updated");
		}
	} finally {
		if (connection) connection.release();
	}
};
