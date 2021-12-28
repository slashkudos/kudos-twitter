"use strict";
// Adapted from https://github.com/twitterdev/account-activity-dashboard/blob/master/helpers/auth.js
exports.__esModule = true;
exports.ConfigService = void 0;
var ConfigService = /** @class */ (function () {
    function ConfigService(oauth, webhookEnvironment) {
        this.twitterOAuth = oauth;
        this.twitterWebhookEnvironment = webhookEnvironment;
    }
    ConfigService.build = function () {
        var _a = {
            apiKey: process.env.TWITTER_CONSUMER_KEY,
            apiSecret: process.env.TWITTER_CONSUMER_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        }, apiKey = _a.apiKey, apiSecret = _a.apiSecret, accessToken = _a.accessToken, accessTokenSecret = _a.accessTokenSecret;
        if (!apiKey) {
            throw new Error("Required Twitter API Key is missing. Please set the TWITTER_CONSUMER_KEY environment variable.");
        }
        if (!apiSecret) {
            throw new Error("Required Twitter API Secret is missing. Please set the TWITTER_CONSUMER_SECRET environment variable.");
        }
        if (!accessToken) {
            throw new Error("Required Twitter Access Token is missing. Please set the TWITTER_ACCESS_TOKEN environment variable.");
        }
        if (!accessTokenSecret) {
            throw new Error("Required Twitter Access Token Secret is missing. Please set the TWITTER_ACCESS_TOKEN_SECRET environment variable.");
        }
        var twitterOAuth = {
            apiKey: apiKey,
            apiSecret: apiSecret,
            accessToken: accessToken,
            accessTokenSecret: accessTokenSecret
        };
        var twitterWebhookEnvironment = process.env.TWITTER_WEBHOOK_ENV;
        if (!twitterWebhookEnvironment)
            throw new Error("Required Twitter Webhook Environment is missing. Please set the TWITTER_WEBHOOK_ENV environment variable.");
        return new ConfigService(twitterOAuth, twitterWebhookEnvironment);
    };
    return ConfigService;
}());
exports.ConfigService = ConfigService;
