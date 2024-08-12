import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

async function bootstrap() {
  let app;
  const port = process.env.PORT || 3000;
  console.log(port);
  // Check if HTTPS is enabled in the environment variables
  if (process.env.HTTPS_ENABLED === 'true') {
    const httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    };

    // Create an HTTPS server
    app = await NestFactory.create(AppModule, { httpsOptions });
  } else {
    // Create a regular HTTP server
    app = await NestFactory.create(AppModule);
  }

  await app.listen(port, () => {
    console.log(
      `[🔥] App is listening on ${port}... (${
        process.env.HTTPS_ENABLED === 'true' ? 'HTTPS' : 'HTTP'
      })`,
    );
  });
}

bootstrap();
