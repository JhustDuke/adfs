export interface cardLayoutInterface {
	title: string;
	href: string;
	content: string;

	// Image is compulsory
	image: string;

	// Background color for the card
	bgColor?: string;

	// Button color
	btnClass?: string;
}
