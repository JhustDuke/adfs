import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(function (
	{ url, request, cookies },
	next
) {
	if (!url.pathname.startsWith("/dashboard")) {
		return next();
	}

	const session = cookies.get("dashboard_session")?.value;
	const expiry = cookies.get("dashboard_expiry")?.value;

	const isValid =
		session === "authenticated" && expiry && Date.now() < parseInt(expiry, 10);

	if (!isValid) {
		cookies.delete("dashboard_session", { path: "/" });
		cookies.delete("dashboard_expiry", { path: "/" });
		return Response.redirect(new URL("/login", request.url), 302);
	}

	return next();
});
