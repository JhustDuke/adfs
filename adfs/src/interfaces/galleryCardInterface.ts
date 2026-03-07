export interface galleryCardInterface {
	title: string;
	date?: string;
	images: { src: string; caption: string }[]; // Updated to accept objects with captions
	folderId: string;
}
