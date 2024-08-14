import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('BACKEND_PORT') || 3000;

  app.enableCors({
    origin: '*',
  })

  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(PORT);
  console.log(`[HTTP] app is running on: http://localhost:${PORT}`);
}
bootstrap();
