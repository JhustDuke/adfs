import fs from "fs";

/*it checks if a directory exist, or creates it if doesn't*/
export const ensureUploadDir = function (uploadDir: string) {
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}
};
