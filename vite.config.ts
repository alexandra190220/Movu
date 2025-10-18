import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Dev server proxy to avoid CORS when developing locally
  server: {
    proxy: {
      // forward any /api/v1 requests to the Render backend during dev
      '/api/v1': {
        target: 'https://movu-back.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
