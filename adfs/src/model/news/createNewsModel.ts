import { appPool } from "../config";

export const createNewsModel = async function (
	title: string,
	date: string,
	excerpt: string,
	fullText: string,
	category: string
): Promise<void> {
	let connection;

	try {
		connection = await appPool.getConnection();

		await connection.query(
			`
			INSERT INTO news_table (title, date, excerpt, full_text, category)
			VALUES (?, ?, ?, ?, ?)
			`,
			[title, date, excerpt, fullText, category]
		);
	} finally {
		if (connection) connection.release();
	}
};
