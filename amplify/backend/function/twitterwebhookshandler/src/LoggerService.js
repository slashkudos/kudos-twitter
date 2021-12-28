"use strict";
exports.__esModule = true;
exports.LoggerService = void 0;
var winston = require("winston");
var logConfiguration = {
    level: process.env.LOG_LEVEL || "debug",
    transports: [new winston.transports.Console()]
};
var LoggerService = /** @class */ (function () {
    function LoggerService() {
    }
    LoggerService.createLogger = function () { return winston.createLogger(logConfiguration); };
    return LoggerService;
}());
exports.LoggerService = LoggerService;
