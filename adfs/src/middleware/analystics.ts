import { defineMiddleware } from "astro:middleware";
import { insertAnalysticModel } from "../model/analystics/createAnalysticsModel";
//import { insertDiagnosticModel } from './model/diagnosticModel';

export const analysticsMiddleware = defineMiddleware(async function (
	context,
	next
) {
	logAnalystics(context).catch(function (err) {
		console.error("diagnostic log failed:", err);
	});
	return next();
});

// --- HELPERS ---
async function logAnalystics(
	context: Parameters<Parameters<typeof defineMiddleware>[0]>[0]
) {
	const ip =
		context.request.headers.get("x-forwarded-for") ||
		context.clientAddress ||
		"unknown";
	const page = context.url.pathname;
	await insertAnalysticModel({ ip, page });
}
