"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ConfigService = void 0;
var aws = require("aws-sdk");
var LoggerService_1 = require("./LoggerService");
var ConfigService = /** @class */ (function () {
    function ConfigService(twitterConfig, kudosGraphQLConfig, logger) {
        this.twitterConfig = twitterConfig;
        this.kudosGraphQLConfig = kudosGraphQLConfig;
        this.logger = logger;
    }
    ConfigService.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var logger, Parameters, secretPrefix, secretsDict, twitterConfig, kudosGraphQLConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger = LoggerService_1.LoggerService.createLogger();
                        logger.debug("Building ConfigService");
                        logger.debug("Getting SSM secret parameters");
                        return [4 /*yield*/, new aws.SSM()
                                .getParameters({
                                Names: ConfigService.SecretNames.map(function (secretName) { return process.env[secretName]; }),
                                WithDecryption: true
                            })
                                .promise()];
                    case 1:
                        Parameters = (_a.sent()).Parameters;
                        logger.debug("Found ".concat(Parameters.length, "."));
                        secretPrefix = "/AMPLIFY_".concat(process.env.AWS_LAMBDA_FUNCTION_NAME.split("-")[0], "_");
                        logger.debug("Building secret dictionary, splitting on ".concat(secretPrefix));
                        secretsDict = {};
                        Parameters.forEach(function (parm) {
                            var name = parm.Name.split(secretPrefix)[1];
                            logger.debug("Setting secret '".concat(name, "' (Full name: '").concat(parm.Name, "')"));
                            secretsDict[name] = parm.Value;
                        });
                        twitterConfig = ConfigService.getTwitterConfig(secretsDict);
                        kudosGraphQLConfig = {
                            ApiKey: secretsDict["KUDOS_GRAPHQL_API_KEY"],
                            ApiUrl: process.env.KUDOS_GRAPHQL_ENDPOINT
                        };
                        return [2 /*return*/, new ConfigService(twitterConfig, kudosGraphQLConfig, logger)];
                }
            });
        });
    };
    ConfigService.getTwitterConfig = function (secretsDict) {
        var twitterConfig = {
            appKey: secretsDict["TWITTER_CONSUMER_KEY"],
            appSecret: secretsDict["TWITTER_CONSUMER_SECRET"],
            accessToken: secretsDict["TWITTER_ACCESS_TOKEN"],
            accessSecret: secretsDict["TWITTER_ACCESS_TOKEN_SECRET"],
            webhookEnvironment: process.env.TWITTER_WEBHOOK_ENV
        };
        if (!twitterConfig.appKey) {
            throw new Error("Required Twitter API Key is missing. Please set the TWITTER_CONSUMER_KEY environment variable.");
        }
        if (!twitterConfig.appSecret) {
            throw new Error("Required Twitter API Secret is missing. Please set the TWITTER_CONSUMER_SECRET environment variable.");
        }
        if (!twitterConfig.accessToken) {
            throw new Error("Required Twitter Access Token is missing. Please set the TWITTER_ACCESS_TOKEN environment variable.");
        }
        if (!twitterConfig.accessSecret) {
            throw new Error("Required Twitter Access Token Secret is missing. Please set the TWITTER_ACCESS_TOKEN_SECRET environment variable.");
        }
        if (!twitterConfig.webhookEnvironment)
            throw new Error("Required Twitter Webhook Environment is missing. Please set the TWITTER_WEBHOOK_ENV environment variable.");
        return twitterConfig;
    };
    ConfigService.SecretNames = [
        "KUDOS_GRAPHQL_API_KEY",
        "TWITTER_ACCESS_TOKEN_SECRET",
        "TWITTER_ACCESS_TOKEN",
        "TWITTER_CONSUMER_KEY",
        "TWITTER_CONSUMER_SECRET",
    ];
    return ConfigService;
}());
exports.ConfigService = ConfigService;
