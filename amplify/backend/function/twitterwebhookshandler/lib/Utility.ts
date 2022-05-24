import { APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpStatus } from "aws-sdk/clients/lambda";
import { createApiResultOptions } from "./CreateApiResultOptions";
import { LoggerService } from "./LoggerService";

const logger = LoggerService.createLogger();

export default class Utility {
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
}
