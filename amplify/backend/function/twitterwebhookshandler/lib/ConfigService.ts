import * as aws from "aws-sdk";
import * as winston from "winston";
import { LoggerService } from "./LoggerService";

export interface TwitterOAuth {
  appKey: string;
  appSecret: string;
  accessToken: string;
  accessSecret: string;
}

export class ConfigService {
  private static SecretNames = ["TWITTER_CONSUMER_KEY", "TWITTER_CONSUMER_SECRET", "TWITTER_ACCESS_TOKEN", "TWITTER_ACCESS_TOKEN_SECRET"];
  public readonly twitterOAuth: TwitterOAuth;

  public readonly twitterWebhookEnvironment: string;
  private readonly _logger: winston.Logger;

  public constructor(oauth: TwitterOAuth, webhookEnvironment: string, logger: winston.Logger) {
    this.twitterOAuth = oauth;
    this.twitterWebhookEnvironment = webhookEnvironment;
    this._logger = logger;
  }

  static async build(): Promise<ConfigService> {
    const logger = LoggerService.createLogger();
    logger.debug("Building ConfigService");

    logger.debug("Getting SSM secret parameters");
    const { Parameters } = await new aws.SSM()
      .getParameters({
        Names: ConfigService.SecretNames.map((secretName) => process.env[secretName]),
        WithDecryption: true,
      })
      .promise();

    logger.debug(`Found ${Parameters.length}.`);

    const secretPrefix = `/AMPLIFY_${process.env.AWS_LAMBDA_FUNCTION_NAME.split("-")[0]}_`;
    logger.debug(`Building secret dictionary, splitting on ${secretPrefix}`);

    const secretsDict = {};
    Parameters.forEach((parm) => {
      const name = parm.Name.split(secretPrefix)[1];
      logger.debug(`Setting secret '${name}' (Full name: '${parm.Name}')`);
      secretsDict[name] = parm.Value;
    });

    const { appKey, appSecret, accessToken, accessSecret } = {
      appKey: secretsDict["TWITTER_CONSUMER_KEY"],
      appSecret: secretsDict["TWITTER_CONSUMER_SECRET"],
      accessToken: secretsDict["TWITTER_ACCESS_TOKEN"],
      accessSecret: secretsDict["TWITTER_ACCESS_TOKEN_SECRET"],
    };
    if (!appKey) {
      throw new Error("Required Twitter API Key is missing. Please set the TWITTER_CONSUMER_KEY environment variable.");
    }
    if (!appSecret) {
      throw new Error("Required Twitter API Secret is missing. Please set the TWITTER_CONSUMER_SECRET environment variable.");
    }
    if (!accessToken) {
      throw new Error("Required Twitter Access Token is missing. Please set the TWITTER_ACCESS_TOKEN environment variable.");
    }
    if (!accessSecret) {
      throw new Error("Required Twitter Access Token Secret is missing. Please set the TWITTER_ACCESS_TOKEN_SECRET environment variable.");
    }
    const twitterOAuth: TwitterOAuth = {
      appKey: appKey,
      appSecret: appSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    };
    const twitterWebhookEnvironment = process.env.TWITTER_WEBHOOK_ENV;
    if (!twitterWebhookEnvironment)
      throw new Error("Required Twitter Webhook Environment is missing. Please set the TWITTER_WEBHOOK_ENV environment variable.");
    return new ConfigService(twitterOAuth, twitterWebhookEnvironment, logger);
  }
}
