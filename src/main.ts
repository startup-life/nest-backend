import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {TimeoutInterceptor} from "./common/interceptor/timeout.interceptor";
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 글로벌 Interceptor 설정
  app.useGlobalInterceptors(new TimeoutInterceptor());

  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
