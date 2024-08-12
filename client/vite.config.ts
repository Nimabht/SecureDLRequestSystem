import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from the `.env` file
dotenv.config();

let httpsConfig;

if (
  process.env.VITE_HTTPS_ENABLED === "true" &&
  !!process.env.SSL_KEY_PATH &&
  !!process.env.SSL_CERT_PATH
) {
  const keyPath = path.resolve(__dirname, process.env.SSL_KEY_PATH);
  const certPath = path.resolve(__dirname, process.env.SSL_CERT_PATH);

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    httpsConfig = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  } else {
    console.warn("HTTPS is enabled, but key.pem or cert.pem file is missing.");
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    https: httpsConfig, // Use the https configuration only if it exists
  },
});
