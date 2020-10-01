import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, Inject, HttpStatus }  from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger as WinstonLogger } from "winston";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        const context = host.switchToHttp();
        const request = context.getRequest();
        const response = context.getResponse();
        const statusCode = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof HttpException
            ? exception.message
            : "Internal server error";

        
        const errorResponse = {
            code: statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: message,
        }

        Logger.error(
            `${request.method} ${request.url}`, JSON.stringify(errorResponse), 'ExceptionFilter',
        );
        
        this.logger.log('error', `${request.method} ${request.url}, Error Code: ${errorResponse.code}, Error: ${errorResponse.message}`);

        response.status(statusCode).json(errorResponse);
    }
}
/* import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, Inject }  from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger as WinstonLogger } from "winston";

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger) { }

    catch(exception: HttpException, host: ArgumentsHost): void {
        const context = host.switchToHttp();
        const request = context.getRequest();
        const response = context.getResponse();
        const statusCode = exception.getStatus();
        
        const errorResponse = {
            code: statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception.message || null,
        }

        Logger.error(
            `${request.method} ${request.url}`, JSON.stringify(errorResponse), 'ExceptionFilter',
        );
        
        this.logger.log('error', `${request.method} ${request.url}, Error Code: ${errorResponse.code}, Error: ${errorResponse.message}`);

        response.status(statusCode).json(errorResponse);
    }
} */