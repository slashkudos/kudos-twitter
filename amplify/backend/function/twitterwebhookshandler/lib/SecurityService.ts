// Adapted from https://github.com/twitterdev/account-activity-dashboard/blob/master/helpers/security.js

import { createHmac } from "crypto";

export class SecurityService {
  /**
   * Creates a HMAC SHA-256 hash created from the app TOKEN and
   * your app Consumer Secret.
   * @param  token  the token provided by the incoming GET request
   * @return string
   */
  static getHashSignature = function (apiSecret: string, body: string): string {
    const hmacHash = createHmac("sha256", apiSecret).update(body).digest("base64");
    const signature = "sha256=" + hmacHash;
    return signature;
  };
}
