import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { ConfigService } from "./ConfigService";
import { LoggerService } from "./LoggerService";
import { SecurityService } from "./SecurityService";
import { ActivityEvent, FollowEventActivity, TweetCreateEventActivity } from "./types/twitter-types";
import { KudosApiClient } from "@slashkudos/kudos-api";
import Utilities from "./Utilities";
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
        return Utilities.createApiResult(body, 200, { stringify: false });
      } else {
        return Utilities.createApiResult("The crc_token is missing from the request.", 400);
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
        return Utilities.createApiResult("The request is not coming from Twitter.", 403);
      }
      logger.info("Validated the request is coming from Twitter.");

      const eventBody = JSON.parse(event.body) as ActivityEvent;
      const twitterClient = new TwitterApi(configService.twitterConfig);
      const appUser = await twitterClient.currentUser();

      if (eventBody.for_user_id !== appUser.id_str) {
        return Utilities.createApiResult("This tweet is not for this app.", 200);
      }

      if (eventBody.tweet_create_events && eventBody.user_has_blocked === false) {
        const tweetCreateEventActivity = eventBody as TweetCreateEventActivity;
        return await TweetCreateEventsActivityHandler.handleIt(tweetCreateEventActivity, twitterClient, kudosApiClient);
      }

      if (eventBody.follow_events) {
        const followEventActivity = eventBody as FollowEventActivity;
        const followEvent = followEventActivity.follow_events[0];
        if (followEvent.type === "follow") {
          return await FollowEventsHandler.handleIt(followEventActivity, twitterClient);
        }
      }

      return Utilities.createApiResult("This event is not handled by app.", 404);
    }
  } catch (error) {
    Utilities.logError(error);
    return Utilities.createApiResult("Failed to handle event.", 500);
  }

  return Utilities.createApiResult(`This event is not handled by app.`, 404);
}
