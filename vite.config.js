// Fix: DSCVR rollback

// import { sentryVitePlugin } from "@sentry/vite-plugin";
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     sentryVitePlugin({
//       org: "lenspost-labs",
//       project: "lenspost-main-app",
//     }),
//   ],

//   build: {
//     sourcemap: true,
//     rollupOptions: {
//       output: {
//         inlineDynamicImports: false,
//       },
//     },
//   },

//   server: {
//     hmr: false, // Disable HMR to avoid inline script injection
//     headers: {
//       "Content-Security-Policy":
//         "default-src 'self'; connect-src 'self' http://localhost:* https://*.poster.fun/ https://app.poster.fun/; img-src 'self' https://*.poster.fun/ https://app.poster.fun/; script-src 'self'; style-src 'self' 'unsafe-inline';",
//     },
//   },
// });

import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "lenspost-labs",
      project: "lenspost-main-app",
    }),
  ],

  build: {
    sourcemap: true,
  },

  server: {
    allowedHosts: [
      "8729-49-36-144-181.ngrok-free.app",
      // ... existing hosts ...
    ],
    // ... existing code ...
  },
});
