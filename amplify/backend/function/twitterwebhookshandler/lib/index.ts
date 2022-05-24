import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { ConfigService } from "./ConfigService";
import { LoggerService } from "./LoggerService";
import { SecurityService } from "./SecurityService";
import { FollowEventActivity, TweetCreateEventActivity } from "./types/twitter-types";
import { KudosApiClient } from "@slashkudos/kudos-api";
import Utility from "./Utility";
import { TwitterApi } from "twitter-api-v2";
import FollowEventsHandler from "./FollowEventsHandler";
import TweetCreateEventsActivityHandler from "./TweetCreateEventsHandler";

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
        return Utility.createApiResult(body, 200, { stringify: false });
      } else {
        return Utility.createApiResult("crc_token missing from request.", 400);
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
        return Utility.createApiResult("Unathorized. POST request is not originating from Twitter.", 403);
      }
      logger.info("Validated the request is coming from Twitter.");

      const eventBody = JSON.parse(event.body);
      const twitterClient = new TwitterApi(configService.twitterConfig);
      const appUser = await twitterClient.currentUser();

      if (eventBody.for_user_id !== appUser.id_str) {
        return Utility.createApiResult("Tweet is not for this app. Exiting", 200);
      }

      if (eventBody.tweet_create_events && eventBody.user_has_blocked === false) {
        const tweetCreateEventActivity = eventBody.tweet_create_events as TweetCreateEventActivity;
        return await TweetCreateEventsActivityHandler.handleIt(tweetCreateEventActivity, twitterClient, kudosApiClient);
      }
      if (eventBody.follow_events) {
        const followEventActivity = eventBody.follow_events as FollowEventActivity;
        const followEvent = followEventActivity.follow_events[0];
        if (followEvent.type === "follow") {
          return await FollowEventsHandler.handleIt(followEventActivity, twitterClient);
        }
      }
      return Utility.createApiResult("Event is not handled by app. Exiting", 200);
    }
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }

  const message = `Received an unhandled ${httpMethod} request.
  Request Body: ${event.body}`;

  return Utility.createApiResult(message, 404);
}
