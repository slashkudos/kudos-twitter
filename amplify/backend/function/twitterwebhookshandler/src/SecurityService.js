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
    SecurityService.getHashSignature = function (apiSecret, body) {
        var hmacHash = (0, crypto_1.createHmac)("sha256", apiSecret).update(body).digest("base64");
        var signature = "sha256=" + hmacHash;
        return signature;
    };
    return SecurityService;
}());
exports.SecurityService = SecurityService;
