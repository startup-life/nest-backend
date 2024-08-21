import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
  })

  app.useStaticAssets(join(__dirname, '..', 'public'));

  // 글로벌 Interceptor 설정
  app.useGlobalInterceptors(new TimeoutInterceptor());

  await app.listen(3000);
  console.log(`[HTTP] app is running on: http://localhost:3000`);
}
bootstrap();
