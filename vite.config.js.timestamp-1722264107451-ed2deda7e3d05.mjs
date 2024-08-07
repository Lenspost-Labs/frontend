// vite.config.js
import { sentryVitePlugin } from "file:///Users/Crypt/Code/One%20Last%20Folder/Websites/frontend/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import { defineConfig } from "file:///Users/Crypt/Code/One%20Last%20Folder/Websites/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///Users/Crypt/Code/One%20Last%20Folder/Websites/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "lenspost-labs",
    project: "lenspost-main-app"
  })],
  build: {
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvQ3J5cHQvQ29kZS9PbmUgTGFzdCBGb2xkZXIvV2Vic2l0ZXMvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9DcnlwdC9Db2RlL09uZSBMYXN0IEZvbGRlci9XZWJzaXRlcy9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvQ3J5cHQvQ29kZS9PbmUlMjBMYXN0JTIwRm9sZGVyL1dlYnNpdGVzL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gXCJAc2VudHJ5L3ZpdGUtcGx1Z2luXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIHNlbnRyeVZpdGVQbHVnaW4oe1xuICAgIG9yZzogXCJsZW5zcG9zdC1sYWJzXCIsXG4gICAgcHJvamVjdDogXCJsZW5zcG9zdC1tYWluLWFwcFwiXG4gIH0pXSxcblxuICBidWlsZDoge1xuICAgIHNvdXJjZW1hcDogdHJ1ZVxuICB9XG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1UsU0FBUyx3QkFBd0I7QUFDaFgsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsaUJBQWlCO0FBQUEsSUFDbEMsS0FBSztBQUFBLElBQ0wsU0FBUztBQUFBLEVBQ1gsQ0FBQyxDQUFDO0FBQUEsRUFFRixPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsRUFDYjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
