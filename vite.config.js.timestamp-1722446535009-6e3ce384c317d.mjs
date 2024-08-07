// vite.config.js
import { sentryVitePlugin } from "file:///Volumes/Macintosh%20HD%20-%20Data/Projects/Lenspost/frontend/node_modules/.pnpm/@sentry+vite-plugin@2.21.1/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import { defineConfig } from "file:///Volumes/Macintosh%20HD%20-%20Data/Projects/Lenspost/frontend/node_modules/.pnpm/vite@4.5.3/node_modules/vite/dist/node/index.js";
import react from "file:///Volumes/Macintosh%20HD%20-%20Data/Projects/Lenspost/frontend/node_modules/.pnpm/@vitejs+plugin-react@3.1.0_vite@4.5.3/node_modules/@vitejs/plugin-react/dist/index.mjs";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVm9sdW1lcy9NYWNpbnRvc2ggSEQgLSBEYXRhL1Byb2plY3RzL0xlbnNwb3N0L2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVm9sdW1lcy9NYWNpbnRvc2ggSEQgLSBEYXRhL1Byb2plY3RzL0xlbnNwb3N0L2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Wb2x1bWVzL01hY2ludG9zaCUyMEhEJTIwLSUyMERhdGEvUHJvamVjdHMvTGVuc3Bvc3QvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBzZW50cnlWaXRlUGx1Z2luIH0gZnJvbSBcIkBzZW50cnkvdml0ZS1wbHVnaW5cIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgc2VudHJ5Vml0ZVBsdWdpbih7XG4gICAgb3JnOiBcImxlbnNwb3N0LWxhYnNcIixcbiAgICBwcm9qZWN0OiBcImxlbnNwb3N0LW1haW4tYXBwXCJcbiAgfSldLFxuXG4gIGJ1aWxkOiB7XG4gICAgc291cmNlbWFwOiB0cnVlXG4gIH1cbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VixTQUFTLHdCQUF3QjtBQUM5WCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxpQkFBaUI7QUFBQSxJQUNsQyxLQUFLO0FBQUEsSUFDTCxTQUFTO0FBQUEsRUFDWCxDQUFDLENBQUM7QUFBQSxFQUVGLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxFQUNiO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
