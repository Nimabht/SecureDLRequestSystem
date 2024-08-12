import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { logger } from '../logger/logger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus ? exception.getStatus() : 500;
    const message = exception.message || 'Internal server error';
    const stack = exception.stack;

    logger('error', {
      level: 'info',
      message: JSON.stringify({
        request: `[${request.method}] ${request.url}`,
        exception,
        status,
        message,
        stack,
      }),
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      exception,
    });
  }
}
