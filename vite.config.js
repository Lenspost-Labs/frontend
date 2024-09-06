// Fix: DSCVR rollback

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
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
      },
    },
  },

  server: {
    hmr: false, // Disable HMR to avoid inline script injection
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; connect-src 'self' http://localhost:* https://*.poster.fun/ https://app.poster.fun/; img-src 'self' https://*.poster.fun/ https://app.poster.fun/ https://*.amazonaws.com https://imgflip.com; script-src 'self'; style-src 'self' 'unsafe-inline';",
    },
  },
});

// Working code as of 6Sep24 - If needed to revert
// import { sentryVitePlugin } from "@sentry/vite-plugin";
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), sentryVitePlugin({
//     org: "lenspost-labs",
//     project: "lenspost-main-app"
//   })],

//   build: {
//     sourcemap: true
//   }
// })
