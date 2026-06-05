import { appPool } from "../config";
import fs from "fs";
import path from "path";
import { ensureUploadDir, imageDir, DBTableNames } from "../../utils";

interface CreateAcademicPageInputInterface {
	caption: string;
	excerpts: string;
	imageBuffer: Buffer;
	imageOriginalName: string;
	textCaptionColor?: string | null;
	bgColor?: string | null;
}

const imagePath = imageDir.galleryCollection;

const uploadDir: string = path.join(process.cwd(), imagePath);

export const createGallleryModel = function () {};
