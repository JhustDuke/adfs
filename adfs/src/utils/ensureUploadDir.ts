import fs from "fs";

export const ensureUploadDir = function (uploadDir: string) {
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}
};
