import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    // 먼저 Nest 앱을 생성
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // ConfigService를 가져오기
    const configService = app.get(ConfigService);

    // HTTPS 옵션 설정
    const httpsOptions = {
        key: configService.get<string>('HTTPS_KEY'),
        cert: configService.get<string>('HTTPS_CERT'),
    };

    // HTTPS를 적용할 때 새로운 서버를 생성하지 않고, httpsOptions를 설정해 줍니다.
    const httpsApp = await NestFactory.create<NestExpressApplication>(
        AppModule,
        {
            httpsOptions,
        },
    );

    // 백엔드 포트 설정
    const PORT = configService.get<number>('BACKEND_PORT') || 3000;

    // CORS 설정
    httpsApp.enableCors({
        origin: '*', // 프론트엔드 주소
        credentials: true, // 쿠키 허용
    });

    // 정적 파일 경로 설정
    httpsApp.useStaticAssets(join(__dirname, '..', 'public'));

    // Helmet 미들웨어 사용 (보안 강화)
    httpsApp.use(helmet());

    // 글로벌 Interceptor 설정
    httpsApp.useGlobalInterceptors(new TimeoutInterceptor());

    // 글로벌 ValidationPipe 설정
    httpsApp.useGlobalPipes(new ValidationPipe());

    // Swagger 설정
    const swaggerConfig = new DocumentBuilder()
        .setTitle('NestJS Edu Community Backend API')
        .setDescription('NestJS 기반 Edu Community 프로젝트 백엔드 API 문서')
        .setVersion('1.0')
        .addTag('edu-community')
        .build();
    const document = SwaggerModule.createDocument(httpsApp, swaggerConfig);
    SwaggerModule.setup('api', httpsApp, document);

    // 애플리케이션을 HTTPS 서버에서 실행
    await httpsApp.listen(PORT);
    console.log(`[HTTPS] app is running on: https://localhost:${PORT}`);
}
bootstrap();

/*
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

    // Swagger
    const swaggerConfig = new DocumentBuilder()
        .setTitle('NestJS Edu Community Backend API')
        .setDescription('NestJS 기반 Edu Community 프로젝트 백엔드 API 문서')
        .setVersion('1.0')
        .addTag('edu-community')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    await app.listen(PORT);
    console.log(`[HTTP] app is running on: http://localhost:${PORT}`);
}
bootstrap();
*/
