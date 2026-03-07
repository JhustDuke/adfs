// @ts-check
import { defineConfig } from "astro/config";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
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
