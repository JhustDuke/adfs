import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies }) => {
	cookies.delete("dashboard_session", { path: "/" });
	cookies.delete("dashboard_expiry", { path: "/" });

	return new Response(JSON.stringify({ message: "Logged out" }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
