import * as winston from "winston";

const logConfiguration: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL || "debug",
  transports: [new winston.transports.Console()],
};

export class LoggerService {
  static createLogger = () => winston.createLogger(logConfiguration);
}
