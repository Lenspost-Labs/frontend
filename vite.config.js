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
        "default-src 'self'; connect-src 'self' https://api.dscvr.one https://api1.stg.dscvr.one https://*.helius-rpc.com https://api.polotno.com https://auth.privy.io https://o4506978044739584.ingest.us.sentry.io; img-src 'self' blob: data: https://ipfs.dscvr.one https://media.dscvr.one https://media1.stg.dscvr.one https://fal.media; script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline' https://eu.posthog.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; style-src-elem 'self' https://unpkg.com; font-src 'self' https://fonts.gstatic.com;",
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
