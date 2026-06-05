export interface ImageInterface {
	url: string;
	subCaption: string;
	file?: File | null;
}

export interface GalleryInterface {
	galleryDB_id: number;
	caption: string;
	date: string;
	images: ImageInterface[];
}

export interface ImageUploadInterface {
	file: File | null;
	subCaption: string;
}
export interface DeleteTargetInterface {
	type: "gallery" | "image";
	galleryDB_id: number;
	imageUrl?: string;
}

export interface AddExistingPayloadInterface {
	galleryDB_id: number;
	images: ImageInterface[];
}
