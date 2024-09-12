import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as Sentry from '@sentry/node';
import { AllExceptionsFilter } from './common/filter/http-exception.filter';
import { RequestLoggingInterceptor } from './common/interceptor/request-loggin.interceptor';

// Sentry 초기화 함수
function initializeSentry(): void {
    Sentry.init({
        dsn: 'https://953854d18afb15cf0fe91f9450b76487@o4507938152644608.ingest.us.sentry.io/4507938177351680',
        tracesSampleRate: 0.0,
        debug: true,
    });
}

// 공통 설정 함수 (CORS, Helmet, ValidationPipe, Interceptors 등)
function setupCommonMiddlewares(app: NestExpressApplication) {
    // CORS 설정
    app.enableCors({
        origin: '*', // 프론트엔드 주소
        credentials: true, // 쿠키 허용
    });

    // 정적 파일 경로 설정
    app.useStaticAssets(join(__dirname, '..', 'public'));

    // Helmet 미들웨어 사용 (보안 강화)
    app.use(helmet());

    // 글로벌 Interceptor 설정
    app.useGlobalInterceptors(new TimeoutInterceptor());
    app.useGlobalInterceptors(new RequestLoggingInterceptor());

    // 글로벌 ValidationPipe 설정
    app.useGlobalPipes(new ValidationPipe());

    // 글로벌 예외 필터 등록
    app.useGlobalFilters(new AllExceptionsFilter());
}

// Swagger 설정 함수
function setupSwagger(app: NestExpressApplication) {
    const swaggerConfig = new DocumentBuilder()
        .setTitle('NestJS Edu Community Backend API')
        .setDescription('NestJS 기반 Edu Community 프로젝트 백엔드 API 문서')
        .setVersion('1.0')
        .addTag('edu-community')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
}

// HTTPS 옵션 설정 함수
function getHttpsOptions(configService: ConfigService) {
    const httpsKey = configService.get<string>('HTTPS_KEY');
    const httpsCert = configService.get<string>('HTTPS_CERT');

    return {
        key: fs.readFileSync(httpsKey, 'utf8'),
        cert: fs.readFileSync(httpsCert, 'utf8'),
    };
}

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    const NODE_ENV = configService.get<string>('NODE_ENV') || 'development';
    const PORT = configService.get<number>('BACKEND_PORT') || 3000;

    // Sentry 초기화 (환경에 관계없이)
    initializeSentry();

    if (NODE_ENV === 'development') {
        // 공통 설정 적용
        setupCommonMiddlewares(app);

        // Swagger 설정
        setupSwagger(app);

        // 개발 환경에서는 HTTP로 서버 실행
        await app.listen(PORT);
        console.log(`[HTTP] app is running on: http://localhost:${PORT}`);
    } else {
        // HTTPS 옵션 설정
        const httpsOptions = getHttpsOptions(configService);

        // HTTPS를 적용할 때 새로운 서버를 생성하지 않고, httpsOptions를 설정
        const httpsApp = await NestFactory.create<NestExpressApplication>(
            AppModule,
            { httpsOptions },
        );

        // 공통 설정 적용
        setupCommonMiddlewares(httpsApp);

        // Swagger 설정
        setupSwagger(httpsApp);

        // HTTPS 환경에서 서버 실행
        await httpsApp.listen(PORT);
        console.log(`[HTTPS] app is running on: https://localhost:${PORT}`);
    }
}

bootstrap();

/*
async function bootstrap() {
    // 먼저 Nest 앱을 생성
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // ConfigService를 가져오기
    const configService = app.get(ConfigService);

    const httpsKey = configService.get<string>('HTTPS_KEY');
    const httpsCert = configService.get<string>('HTTPS_CERT');

    console.log('HTTPS Key Path:', httpsKey);
    console.log('HTTPS Cert Path:', httpsCert);

    const httpsOptions = {
        key: fs.readFileSync(httpsKey, 'utf8'),
        cert: fs.readFileSync(httpsCert, 'utf8'),
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
*/
