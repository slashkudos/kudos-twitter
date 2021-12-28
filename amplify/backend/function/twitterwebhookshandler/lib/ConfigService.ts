import * as aws from "aws-sdk";

export interface TwitterOAuth {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export class ConfigService {
  private static SecretNames = ["TWITTER_CONSUMER_KEY", "TWITTER_CONSUMER_SECRET", "TWITTER_ACCESS_TOKEN", "TWITTER_ACCESS_TOKEN_SECRET"];
  public readonly twitterOAuth: TwitterOAuth;

  public readonly twitterWebhookEnvironment: string;

  public constructor(oauth: TwitterOAuth, webhookEnvironment: string) {
    this.twitterOAuth = oauth;
    this.twitterWebhookEnvironment = webhookEnvironment;
  }

  static async build(): Promise<ConfigService> {
    const { Parameters } = await new aws.SSM()
      .getParameters({
        Names: ConfigService.SecretNames.map((secretName) => process.env[secretName]),
        WithDecryption: true,
      })
      .promise();

    const secretsDict = {};
    Parameters.forEach((parm) => (secretsDict[parm.Name] = parm.Value));

    const { apiKey, apiSecret, accessToken, accessTokenSecret } = {
      apiKey: secretsDict["TWITTER_CONSUMER_KEY"],
      apiSecret: secretsDict["TWITTER_CONSUMER_SECRET"],
      accessToken: secretsDict["TWITTER_ACCESS_TOKEN"],
      accessTokenSecret: secretsDict["TWITTER_ACCESS_TOKEN_SECRET"],
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
