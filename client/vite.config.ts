import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from the `.env` file
dotenv.config();

let httpsConfig;
let origin = "http://0.0.0.0:8080";

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
    origin = "https://0.0.0.0:8080";
  } else {
    console.warn("HTTPS is enabled, but key.pem or cert.pem file is missing.");
  }
}

const config: any = {
  plugins: [react()],
  server: {
    https: httpsConfig, // Use the https configuration only if it exists
  },
};

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  // Production-specific configuration
  config.base = "/";
  config.preview = {
    port: 8080,
    strictPort: true,
  };
  config.server.port = 8080;
  config.server.strictPort = true;
  config.server.host = true;
  config.server.origin = origin;
}

export default defineConfig(config);
