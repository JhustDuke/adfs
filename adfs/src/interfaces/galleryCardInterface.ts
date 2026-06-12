export interface galleryCardInterface {
	id: number;
	caption: string;
	date?: string;
	images: { url: string; subCaption: string }[];
}
