import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, Inject }  from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger as WinstonLogger } from "winston";

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger) { }

    catch(exception: HttpException, host: ArgumentsHost): void {
        const context = host.switchToHttp();
        const request = context.getRequest();
        const response = context.getResponse();
        const statusCode = exception.getStatus();

        const errorResponse = {
            code: statusCode,
            timestamp: new Date().toLocaleDateString(),
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
}