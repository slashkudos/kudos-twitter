import { KudosGraphQLConfig } from "@slashkudos/kudos-api";
import * as aws from "aws-sdk";
import * as winston from "winston";
import { LoggerService } from "./LoggerService";

export interface TwitterConfig {
  appKey: string;
  appSecret: string;
  accessToken: string;
  accessSecret: string;
  webhookEnvironment: string;
}

type SecretName = "KUDOS_GRAPHQL_API_KEY" | "TWITTER_ACCESS_TOKEN_SECRET" | "TWITTER_ACCESS_TOKEN" | "TWITTER_CONSUMER_KEY" | "TWITTER_CONSUMER_SECRET";

export class ConfigService {
  private static SecretNames: SecretName[] = [
    "KUDOS_GRAPHQL_API_KEY",
    "TWITTER_ACCESS_TOKEN_SECRET",
    "TWITTER_ACCESS_TOKEN",
    "TWITTER_CONSUMER_KEY",
    "TWITTER_CONSUMER_SECRET",
  ];

  public readonly twitterConfig: TwitterConfig;
  public kudosGraphQLConfig: KudosGraphQLConfig;

  private readonly logger: winston.Logger;

  public constructor(twitterConfig: TwitterConfig, kudosGraphQLConfig: KudosGraphQLConfig, logger: winston.Logger) {
    this.twitterConfig = twitterConfig;
    this.kudosGraphQLConfig = kudosGraphQLConfig;
    this.logger = logger;
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

    const secretsDict: { [key in SecretName]?: string } = {};
    Parameters.forEach((parm) => {
      const name = parm.Name.split(secretPrefix)[1];
      logger.debug(`Setting secret '${name}' (Full name: '${parm.Name}')`);
      secretsDict[name] = parm.Value;
    });

    const twitterConfig: TwitterConfig = ConfigService.getTwitterConfig(secretsDict);

    const kudosGraphQLConfig: KudosGraphQLConfig = {
      ApiKey: secretsDict["KUDOS_GRAPHQL_API_KEY"],
      ApiUrl: process.env.KUDOS_GRAPHQL_ENDPOINT,
    };

    return new ConfigService(twitterConfig, kudosGraphQLConfig, logger);
  }

  private static getTwitterConfig(secretsDict: { [key in SecretName]?: string }) {
    const twitterConfig: TwitterConfig = {
      appKey: secretsDict["TWITTER_CONSUMER_KEY"],
      appSecret: secretsDict["TWITTER_CONSUMER_SECRET"],
      accessToken: secretsDict["TWITTER_ACCESS_TOKEN"],
      accessSecret: secretsDict["TWITTER_ACCESS_TOKEN_SECRET"],
      webhookEnvironment: process.env.TWITTER_WEBHOOK_ENV,
    };
    if (!twitterConfig.appKey) {
      throw new Error("Required Twitter API Key is missing. Please set the TWITTER_CONSUMER_KEY environment variable.");
    }
    if (!twitterConfig.appSecret) {
      throw new Error("Required Twitter API Secret is missing. Please set the TWITTER_CONSUMER_SECRET environment variable.");
    }
    if (!twitterConfig.accessToken) {
      throw new Error("Required Twitter Access Token is missing. Please set the TWITTER_ACCESS_TOKEN environment variable.");
    }
    if (!twitterConfig.accessSecret) {
      throw new Error("Required Twitter Access Token Secret is missing. Please set the TWITTER_ACCESS_TOKEN_SECRET environment variable.");
    }
    if (!twitterConfig.webhookEnvironment)
      throw new Error("Required Twitter Webhook Environment is missing. Please set the TWITTER_WEBHOOK_ENV environment variable.");
    return twitterConfig;
  }
}
