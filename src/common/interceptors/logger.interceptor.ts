import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggerInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const { method, url } = request;
        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - now;
                const { statusCode } = response;

                this.logRequestMessage(method, url, duration, statusCode)
            }),
            catchError((error) => {
                const duration = Date.now() - now;
                const { method, url } = request;

                this.logRequestMessage(method, url, duration, error.response.statusCode)

                throw error;
            }),
        );
    }

    private logRequestMessage(method: string, url: string, duration: number, statusCode: number) {
        const logMessage = `Response: [${method}] ${url} - ${statusCode} - ${duration}ms`

        if (statusCode >= 200 && statusCode < 300) {
            this.logger.log(logMessage);
        } else if (statusCode >= 300 && statusCode < 400) {
            this.logger.warn(logMessage)
        } else if (statusCode >= 400 && statusCode < 500) {
            this.logger.error(logMessage)
        } else {
            this.logger.fatal(logMessage)
        }
    }
}
