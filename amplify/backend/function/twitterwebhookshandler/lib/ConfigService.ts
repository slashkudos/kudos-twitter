// Adapted from https://github.com/twitterdev/account-activity-dashboard/blob/master/helpers/auth.js

export interface TwitterOAuth {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export class ConfigService {
  public readonly twitterOAuth: TwitterOAuth;

  public readonly twitterWebhookEnvironment: string;

  public constructor(oauth: TwitterOAuth, webhookEnvironment: string) {
    this.twitterOAuth = oauth;
    this.twitterWebhookEnvironment = webhookEnvironment;
  }

  static build(): ConfigService {
    const { apiKey, apiSecret, accessToken, accessTokenSecret } = {
      apiKey: process.env.TWITTER_CONSUMER_KEY,
      apiSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    };
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
    const twitterOAuth: TwitterOAuth = {
      apiKey: apiKey,
      apiSecret: apiSecret,
      accessToken: accessToken,
      accessTokenSecret: accessTokenSecret,
    };
    const twitterWebhookEnvironment = process.env.TWITTER_WEBHOOK_ENV;
    if (!twitterWebhookEnvironment)
      throw new Error("Required Twitter Webhook Environment is missing. Please set the TWITTER_WEBHOOK_ENV environment variable.");
    return new ConfigService(twitterOAuth, twitterWebhookEnvironment);
  }
}
