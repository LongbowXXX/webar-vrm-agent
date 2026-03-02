import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/voicevox": {
        target: "http://192.168.11.50:50021", // Local VoiceVox engine IP
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/voicevox/, ""),
      },
    },
  },
});
