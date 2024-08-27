import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    const PORT = configService.get<number>('BACKEND_PORT') || 3000;

    app.enableCors({
        origin: 'http://localhost:8080', // 프론트엔드 주소
        credentials: true, // 쿠키 허용
    });

    app.useStaticAssets(join(__dirname, '..', 'public'));

    app.use(helmet());

    // 글로벌 Interceptor 설정
    app.useGlobalInterceptors(new TimeoutInterceptor());

    // 글로벌 ValidationPipe 설정 (모든 DTO에서 class-validator를 사용해 유효성 검사 자동 적용)
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT);
    console.log(`[HTTP] app is running on: http://localhost:${PORT}`);
}
bootstrap();
