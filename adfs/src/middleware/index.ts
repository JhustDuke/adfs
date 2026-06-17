import { sequence } from "astro:middleware";
import { staticImagesMiddleware } from "./staticImages";
import { dashboardAuthMiddleware } from "./authDashboard";

export const onRequest = sequence(
	staticImagesMiddleware,
	dashboardAuthMiddleware
);
