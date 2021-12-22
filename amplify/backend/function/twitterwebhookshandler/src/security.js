// Adapted from https://github.com/twitterdev/account-activity-dashboard/blob/master/helpers/security.js

import { createHmac } from 'crypto'

/**
 * Creates a HMAC SHA-256 hash created from the app TOKEN and
 * your app Consumer Secret.
 * @param  token  the token provided by the incoming GET request
 * @return string
 */
export function get_challenge_response(crc_token, consumer_secret) {

  hmac = createHmac('sha256', consumer_secret).update(crc_token).digest('base64')

  return hmac
}
