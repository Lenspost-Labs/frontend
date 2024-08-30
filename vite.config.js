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
        "default-src 'self'; connect-src 'self' http://localhost:* https://*.dial.to/ https://proxy.dial.to/; img-src 'self' https://*.dial.to/ https://proxy.dial.to/; script-src 'self'; style-src 'self' 'unsafe-inline';",
    },
  },
});
