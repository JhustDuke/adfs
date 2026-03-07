interface StaffCarouselMember {
	imgSrc: string;
	caption: string;
	subCaption?: string;
}

export interface staffCarouselInterface {
	AllStaffMembers: StaffCarouselMember[];
	id?: string;
}
