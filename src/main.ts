import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {TimeoutInterceptor} from "./common/interceptor/timeout.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 글로벌 Interceptor 설정
  app.useGlobalInterceptors(new TimeoutInterceptor());

  await app.listen(3000);
}
bootstrap();
