"use strict";
// Adapted from https://github.com/twitterdev/account-activity-dashboard/blob/master/helpers/security.js
exports.__esModule = true;
exports.SecurityService = void 0;
var crypto_1 = require("crypto");
var SecurityService = /** @class */ (function () {
    function SecurityService() {
    }
    /**
     * Creates a HMAC SHA-256 hash created from the app TOKEN and
     * your app Consumer Secret.
     * @param  token  the token provided by the incoming GET request
     * @return string
     */
    SecurityService.get_challenge_response = function (apiSecret, crcToken) {
        var hmac = (0, crypto_1.createHmac)("sha256", apiSecret).update(crcToken).digest("base64");
        return hmac;
    };
    return SecurityService;
}());
exports.SecurityService = SecurityService;
