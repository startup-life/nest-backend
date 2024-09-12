import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, headers } = request;

        // Sentry에 요청 정보 로깅
        Sentry.captureMessage(`Incoming request: ${method} ${url}`, {
            level: 'info', // 로그 레벨 설정
            extra: {
                body, // 요청 본문
                headers, // 요청 헤더
            },
        });

        return next.handle().pipe(
            tap(() => {
                // 추가 작업을 여기에 넣을 수 있습니다.
            }),
        );
    }
}
