// Adapted from https://github.com/twitterdev/account-activity-dashboard/blob/master/helpers/security.js

import { createHmac } from "crypto";

export class SecurityService {
  /**
   * Creates a HMAC SHA-256 hash created from the app TOKEN and
   * your app Consumer Secret.
   * @param  token  the token provided by the incoming GET request
   * @return string
   */
  static get_challenge_response = function (apiSecret: string, crcToken: string) {
    const hmac = createHmac("sha256", apiSecret).update(crcToken).digest("base64");
    return hmac;
  };
}
