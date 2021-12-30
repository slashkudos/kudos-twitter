import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { ConfigService } from "./ConfigService";
import { LoggerService } from "./LoggerService";
import { SecurityService } from "./SecurityService";
import TwitterApi from "twitter-api-v2";
import { TweetCreateEvent } from "./types/twitter-types";

// ANY http method to /webhooks will come here
// See issue: https://github.com/aws-amplify/amplify-cli/issues/1232
// API Gateway Event format: https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html#apigateway-example-event
// Twitter Activity API objects: https://developer.twitter.com/en/docs/twitter-api/premium/account-activity-api/guides/account-activity-data-objects

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResultV2> {
  const httpMethod = event.httpMethod;
  const logger = LoggerService.createLogger();

  try {
    const configService = await ConfigService.build();

    // Return crc token
    if (httpMethod === "GET") {
      logger.info("Received GET request.\nWill return challenge response check (crc) token.");
      const crc_token = event?.queryStringParameters?.crc_token;

      if (crc_token) {
        const hash = SecurityService.get_challenge_response(configService.twitterOAuth.appSecret, crc_token);

        const message = JSON.stringify({
          response_token: "sha256=" + hash,
        });
        logger.warn(message);
        return {
          statusCode: 200,
          body: message,
        };
      } else {
        const message = "crc_token missing from request.";
        logger.warn(message);
        return {
          statusCode: 400,
          body: JSON.stringify(message),
        };
      }
    } else if (httpMethod === "POST") {
      // https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/examples.md
      logger.info("Received a POST request.");
      logger.verbose(`Request Body: ${event.body}`);

      const tweetCreateEvent = JSON.parse(event.body) as TweetCreateEvent;
      if (!tweetCreateEvent || !tweetCreateEvent.tweet_create_events || tweetCreateEvent.user_has_blocked == undefined) {
        const message = "Tweet is not a @mention. Exiting.";
        logger.warn(message);
        return {
          statusCode: 200,
          body: JSON.stringify(message),
        };
      }

      const tweet = tweetCreateEvent.tweet_create_events[0];
      if (!tweet.text.startsWith("/@slashkudos")) {
        const message = "Tweet is not someone giving someone Kudos. Exiting";
        logger.warn(message);
        return {
          statusCode: 200,
          body: JSON.stringify(message),
        };
      }

      const client = new TwitterApi(configService.twitterOAuth);

      const appUser = await client.currentUser();
      const mentions = tweet.entities.user_mentions.filter((mention) => mention.id !== appUser.id);

      for (const mention of mentions) {
        // IMPORTANT: The user who created the original tweet must be mentioned in this reply
        const tweetResponse = `🎉 Congrats @${mention.screen_name}! You received Kudos from @${tweet.user.screen_name}! 💖`;
        logger.info(`Replying to tweet (${tweet.id_str}) with "${tweetResponse}"`);
        await client.v1.reply(tweetResponse, tweet.id_str);
      }

      const message = "Recorded Kudos and responded in a 🧵 on Twitter";
      logger.warn(message);
      return {
        statusCode: 200,
        body: JSON.stringify(message),
      };
    }
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }

  const message = `Received an unhandled ${httpMethod} request.
  Request Body: ${event.body}`;

  logger.warn(message);
  return {
    statusCode: 404,
    body: JSON.stringify(message),
  };
}
