import { sequence } from "astro:middleware";
import { staticImagesMiddleware } from "./staticImages";
import { dashboardAuthMiddleware } from "./authDashboard";
import { analysticsMiddleware } from "./analystics";

export const onRequest = sequence(
	staticImagesMiddleware,
	analysticsMiddleware,
	dashboardAuthMiddleware
);
