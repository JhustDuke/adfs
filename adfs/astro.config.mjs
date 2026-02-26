// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	devToolbar: { enabled: false },
});

// // @ts-check
// import { defineConfig } from "astro/config";

// export default defineConfig({
// 	// ... other astro config
// 	vite: {
// 		ssr: {
// 			noExternal: ["axobject-query"],
// 		},
// 		optimizeDeps: {
// 			exclude: ["axobject-query"],
// 		},
// 	},
// 	devToolbar: { enabled: false },
// });
