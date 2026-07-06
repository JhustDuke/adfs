import fs from "fs";

/*it checks if a directory exist, or creates it if doesn't*/
/**
 * Ensures that the specified upload directory exists. If the directory does not exist,
 * it will be created, including any necessary parent directories.
 *
 * @param uploadDir - The path to the upload directory that needs to be ensured.
 */
export const ensureUploadDir = function (uploadDir: string) {
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}
};
