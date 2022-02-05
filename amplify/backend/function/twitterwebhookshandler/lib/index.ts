import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { ConfigService } from "./ConfigService";
import { LoggerService } from "./LoggerService";
import { SecurityService } from "./SecurityService";
import TwitterApi from "twitter-api-v2";
import { TweetCreateEvent } from "./types/twitter-types";
import { HttpStatus } from "aws-sdk/clients/lambda";
import { LogLevel } from "./types/LogLevel";
import { KudosApiClient } from "@slashkudos/kudos-api/lib/KudosApiClient";

interface createApiResultOptions {
  logLevel?: LogLevel;
  stringify?: boolean;
}

const logger = LoggerService.createLogger();

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResultV2> {
  logger.http(`Received event: ${JSON.stringify(event)}`);
  const httpMethod = event.httpMethod;

  try {
    const configService = await ConfigService.build();
    const kudosApiClient = await KudosApiClient.build(configService.kudosGraphQLConfig);

    if (httpMethod === "GET") {
      logger.info("Received GET request.");
      const crc_token = event?.queryStringParameters?.crc_token;

      if (crc_token) {
        logger.info("Creating challenge response check (crc) hash.");
        const hashSignature = SecurityService.getHashSignature(configService.twitterConfig.appSecret, crc_token);

        const body = JSON.stringify({
          response_token: hashSignature,
        });
        return createApiResult(body, 200, { stringify: false });
      } else {
        return createApiResult("crc_token missing from request.", 400);
      }
    } else if (httpMethod === "POST") {
      // https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/examples.md
      logger.info("Received a POST request.");

      logger.info("Validating X-Twitter-Webhooks-Signature header.");
      const calculatedSignature = SecurityService.getHashSignature(configService.twitterConfig.appSecret, event.body);
      const webhookSignature = event.headers["X-Twitter-Webhooks-Signature"];

      if (calculatedSignature !== webhookSignature) {
        logger.debug(`Webhook Signature: ${webhookSignature}`);
        logger.debug(`Server-side Calculated Signature: ${calculatedSignature}`);
        return createApiResult("Unathorized. POST request is not originating from Twitter.", 403);
      }
      logger.info("Validated the request is coming from Twitter.");

      const tweetCreateEvent = JSON.parse(event.body) as TweetCreateEvent;
      if (!tweetCreateEvent || !tweetCreateEvent.tweet_create_events || tweetCreateEvent.user_has_blocked == undefined) {
        return createApiResult("Tweet is not a @mention. Exiting.", 200);
      }

      const client = new TwitterApi(configService.twitterConfig);
      const appUser = await client.currentUser();
      const appUserMentionStr = `@${appUser.screen_name}`;
      const tweet = tweetCreateEvent.tweet_create_events[0];
      const mentions = tweet.entities.user_mentions.filter((mention) => mention.id !== appUser.id);

      // Skip if the tweet is a reply, or not for the app user, or doesn't start with @appUser
      if (
        !tweet.text.startsWith(appUserMentionStr) ||
        tweetCreateEvent.for_user_id !== appUser.id_str ||
        tweet.in_reply_to_status_id ||
        mentions.length === 0
      ) {
        return createApiResult("Tweet is not someone giving someone Kudos. Exiting", 200);
      }

      const kudosCache = {};

      for (const mention of mentions) {
        try {
          const { giverUsername, receiverUsername } = { giverUsername: tweet.user.screen_name, receiverUsername: mention.screen_name };
          if (kudosCache[receiverUsername]) continue;
          kudosCache[receiverUsername] = true;

          const { receiver } = await kudosApiClient.createKudo(giverUsername, receiverUsername, tweet.text, tweet.id_str);

          // TODO Optimize getting total kudos received
          // FIXME Items is most likely paginated so will not be the total count
          const tweetResponse = `Congrats @${receiverUsername}, you received Kudos from @${giverUsername}! You now have ${receiver.kudosReceived.items.length} points 🎉 💖`;
          logger.info(`Replying to tweet (${tweet.id_str}) with "${tweetResponse}"`);

          await client.v1.reply(tweetResponse, tweet.id_str, { auto_populate_reply_metadata: true });
        } catch (error) {
          logger.error(error.message || error);
        }
      }
      return createApiResult("Recorded Kudos and responded in a 🧵 on Twitter 🐦", 200);
    }
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }

  const message = `Received an unhandled ${httpMethod} request.
  Request Body: ${event.body}`;

  return createApiResult(message, 404);
}

function createApiResult(body: string, statusCode: HttpStatus, options?: createApiResultOptions): APIGatewayProxyResultV2 {
  logger.verbose(`Entering createApiResult`);
  const defaultOptions = { logLevel: "warn", stringify: true };
  const mergedOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
  logger.debug(`createApiResult options: ${JSON.stringify(mergedOptions)}`);
  logger.log(mergedOptions.logLevel, body);
  return {
    statusCode: statusCode,
    body: mergedOptions.stringify ? JSON.stringify(body) : body,
  };
}
