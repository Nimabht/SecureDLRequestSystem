import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

process.env.VITE_HTTPS_ENABLED = "true";

export default defineConfig({
  plugins: [react()],
  server: {
    https:
      process.env.VITE_HTTPS_ENABLED === "true"
        ? {
            key: fs.readFileSync(
              path.resolve(
                __dirname,
                process.env.SSL_KEY_PATH || "../secrets/key.pem",
              ),
            ),
            cert: fs.readFileSync(
              path.resolve(
                __dirname,
                process.env.SSL_KEY_PATH || "../secrets/cert.pem",
              ),
            ),
          }
        : undefined,
  },
});
