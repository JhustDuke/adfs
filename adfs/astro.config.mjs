// @ts-check
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone", // or "middleware"
	}),
	server: {
		host: true,
		port: process.env.PORT ? Number(process.env.PORT) : 4321,
	},
	devToolbar: { enabled: false },
	integrations: [
		vue({
			template: {
				// Treat <center> as a "custom element" so Vue won't warn
				compilerOptions: {
					isCustomElement: (tag) => tag === "center",
				},
			},
		}),
	],
});
