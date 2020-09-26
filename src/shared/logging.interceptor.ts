import { ExecutionContext, Injectable, NestInterceptor, Inject, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) { }

    intercept(context: ExecutionContext, call$: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const now = Date.now();

        return call$.handle().pipe(
            tap(() => this.logger.log('info', `[${context.getClass().name}] ${method} ${url} +${Date.now() - now}ms`)),
        );
    }
}