"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.handler = void 0;
var ConfigService_1 = require("./ConfigService");
var LoggerService_1 = require("./LoggerService");
var SecurityService_1 = require("./SecurityService");
var twitter_api_v2_1 = require("twitter-api-v2");
var KudosApiClient_1 = require("@slashkudos/kudos-api/lib/KudosApiClient");
var logger = LoggerService_1.LoggerService.createLogger();
function handler(event) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var httpMethod, configService, kudosApiClient, crc_token, hashSignature, body, calculatedSignature, webhookSignature, tweetCreateEvent, client, appUser_1, appUserMentionStr, tweet, mentions, kudosCache, _i, mentions_1, mention, _b, giverUsername, receiverUsername, receiver, tweetResponse, error_1, error_2, message;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    logger.http("Received event: ".concat(JSON.stringify(event)));
                    httpMethod = event.httpMethod;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 14, , 15]);
                    return [4 /*yield*/, ConfigService_1.ConfigService.build()];
                case 2:
                    configService = _c.sent();
                    return [4 /*yield*/, KudosApiClient_1.KudosApiClient.build(configService.kudosGraphQLConfig)];
                case 3:
                    kudosApiClient = _c.sent();
                    if (!(httpMethod === "GET")) return [3 /*break*/, 4];
                    logger.info("Received GET request.");
                    crc_token = (_a = event === null || event === void 0 ? void 0 : event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.crc_token;
                    if (crc_token) {
                        logger.info("Creating challenge response check (crc) hash.");
                        hashSignature = SecurityService_1.SecurityService.getHashSignature(configService.twitterConfig.appSecret, crc_token);
                        body = JSON.stringify({
                            response_token: hashSignature
                        });
                        return [2 /*return*/, createApiResult(body, 200, { stringify: false })];
                    }
                    else {
                        return [2 /*return*/, createApiResult("crc_token missing from request.", 400)];
                    }
                    return [3 /*break*/, 13];
                case 4:
                    if (!(httpMethod === "POST")) return [3 /*break*/, 13];
                    // https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/examples.md
                    logger.info("Received a POST request.");
                    logger.info("Validating X-Twitter-Webhooks-Signature header.");
                    calculatedSignature = SecurityService_1.SecurityService.getHashSignature(configService.twitterConfig.appSecret, event.body);
                    webhookSignature = event.headers["X-Twitter-Webhooks-Signature"];
                    if (calculatedSignature !== webhookSignature) {
                        logger.debug("Webhook Signature: ".concat(webhookSignature));
                        logger.debug("Server-side Calculated Signature: ".concat(calculatedSignature));
                        return [2 /*return*/, createApiResult("Unathorized. POST request is not originating from Twitter.", 403)];
                    }
                    logger.info("Validated the request is coming from Twitter.");
                    tweetCreateEvent = JSON.parse(event.body);
                    if (!tweetCreateEvent || !tweetCreateEvent.tweet_create_events || tweetCreateEvent.user_has_blocked == undefined) {
                        return [2 /*return*/, createApiResult("Tweet is not a @mention. Exiting.", 200)];
                    }
                    client = new twitter_api_v2_1["default"](configService.twitterConfig);
                    return [4 /*yield*/, client.currentUser()];
                case 5:
                    appUser_1 = _c.sent();
                    appUserMentionStr = "@".concat(appUser_1.screen_name);
                    tweet = tweetCreateEvent.tweet_create_events[0];
                    mentions = tweet.entities.user_mentions.filter(function (mention) { return mention.id !== appUser_1.id; });
                    // Skip if the tweet is a reply, or not for the app user, or doesn't start with @appUser
                    if (!tweet.text.startsWith(appUserMentionStr) ||
                        tweetCreateEvent.for_user_id !== appUser_1.id_str ||
                        tweet.in_reply_to_status_id ||
                        mentions.length === 0) {
                        return [2 /*return*/, createApiResult("Tweet is not someone giving someone Kudos. Exiting", 200)];
                    }
                    kudosCache = {};
                    _i = 0, mentions_1 = mentions;
                    _c.label = 6;
                case 6:
                    if (!(_i < mentions_1.length)) return [3 /*break*/, 12];
                    mention = mentions_1[_i];
                    _c.label = 7;
                case 7:
                    _c.trys.push([7, 10, , 11]);
                    _b = { giverUsername: tweet.user.screen_name, receiverUsername: mention.screen_name }, giverUsername = _b.giverUsername, receiverUsername = _b.receiverUsername;
                    if (kudosCache[receiverUsername])
                        return [3 /*break*/, 11];
                    kudosCache[receiverUsername] = true;
                    return [4 /*yield*/, kudosApiClient.createKudo(giverUsername, receiverUsername, tweet.text, tweet.id_str)];
                case 8:
                    receiver = (_c.sent()).receiver;
                    tweetResponse = "Congrats @".concat(receiverUsername, ", you received Kudos from @").concat(giverUsername, "! You now have ").concat(receiver.kudosReceived.items.length, " points \uD83C\uDF89 \uD83D\uDC96");
                    logger.info("Replying to tweet (".concat(tweet.id_str, ") with \"").concat(tweetResponse, "\""));
                    return [4 /*yield*/, client.v1.reply(tweetResponse, tweet.id_str, { auto_populate_reply_metadata: true })];
                case 9:
                    _c.sent();
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _c.sent();
                    logger.error(error_1.message || error_1);
                    return [3 /*break*/, 11];
                case 11:
                    _i++;
                    return [3 /*break*/, 6];
                case 12: return [2 /*return*/, createApiResult("Recorded Kudos and responded in a 🧵 on Twitter 🐦", 200)];
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_2 = _c.sent();
                    logger.error(error_2.message || error_2);
                    throw error_2;
                case 15:
                    message = "Received an unhandled ".concat(httpMethod, " request.\n  Request Body: ").concat(event.body);
                    return [2 /*return*/, createApiResult(message, 404)];
            }
        });
    });
}
exports.handler = handler;
function createApiResult(body, statusCode, options) {
    logger.verbose("Entering createApiResult");
    var defaultOptions = { logLevel: "warn", stringify: true };
    var mergedOptions = options ? __assign(__assign({}, defaultOptions), options) : defaultOptions;
    logger.debug("createApiResult options: ".concat(JSON.stringify(mergedOptions)));
    logger.log(mergedOptions.logLevel, body);
    return {
        statusCode: statusCode,
        body: mergedOptions.stringify ? JSON.stringify(body) : body
    };
}
