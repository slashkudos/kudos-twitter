import { APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpStatus } from "aws-sdk/clients/lambda";
import { createApiResultOptions } from "./CreateApiResultOptions";
import { LoggerService } from "./LoggerService";

const logger = LoggerService.createLogger();

export default class Utilities {
  static createApiResult(body: string, statusCode: HttpStatus, options?: createApiResultOptions): APIGatewayProxyResultV2 {
    logger.verbose(`Entering createApiResult`);
    const defaultOptions = { logLevel: "warn", stringify: true };
    const mergedOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    logger.debug(`createApiResult options: ${JSON.stringify(mergedOptions)}`);
    logger.log(mergedOptions.logLevel, body);
    return {
      statusCode: statusCode,
      body: mergedOptions.stringify ? JSON.stringify(body) : body,
    };
  }

  static errorToString(error: Error): string {
    return `${error.name}: ${error.message}\n${error.stack}`;
  }

  static logError(error: Error, message?: string): void {
    if (message) {
      message += "\n";
    } else {
      message = "";
    }
    logger.error(`${message}${this.errorToString(error)}`);
  }
}
