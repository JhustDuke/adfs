export function resolveTextClass(color: string): string {
	switch (color) {
		case "red":
			return "red-text text-darken-3";
		case "blue":
			return "blue-text text-darken-3";
		case "green":
			return "green-text text-darken-3";
		case "indigo":
			return "indigo-text";
		default:
			return "black-text";
	}
}

export function resolveBgClass(color: string): string {
	switch (color) {
		case "red-light":
			return "red lighten-5";
		case "blue-light":
			return "blue lighten-5";
		case "green-light":
			return "green lighten-5";
		case "white":
			return "white";
		default:
			return "grey lighten-2";
	}
}
