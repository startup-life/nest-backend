import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import {ConfigService} from "@nestjs/config";
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';
import helmet from 'helmet';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('BACKEND_PORT') || 3000;

  app.enableCors({
    origin: '*',
  })

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.useGlobalInterceptors(new TimeoutInterceptor());

  // 글로벌 ValidationPipe 설정 (모든 DTO에서 class-validator를 사용해 유효성 검사 자동 적용)
  app.useGlobalPipes(new ValidationPipe());

  app.use(helmet());

  await app.listen(PORT);
  console.log(`[HTTP] app is running on: http://localhost:${PORT}`);
}
bootstrap();
