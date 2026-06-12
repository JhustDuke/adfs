import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const { username, password } = body;

  if (
    username !== import.meta.env.DASHBOARD_USERNAME ||
    password !== import.meta.env.DASHBOARD_PASSWORD
  ) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  cookies.set("dashboard_session", "authenticated", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60,
  });

  cookies.set("dashboard_expiry", String(Date.now() + 60 * 60 * 1000), {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60,
  });

  return new Response(JSON.stringify({ message: "Login successful" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};