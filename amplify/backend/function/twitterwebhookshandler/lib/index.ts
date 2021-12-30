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
  const response = {
    statusCode: 404,
    body: JSON.stringify(`Received an unhandled ${httpMethod} request`),
  };
  const logger = LoggerService.createLogger();

  try {
    const configService = await ConfigService.build();

    // Return crc token
    if (httpMethod === "GET") {
      logger.info("Received GET request.\nWill return challenge response check (crc) token.");
      const crc_token = event?.queryStringParameters?.crc_token;

      if (crc_token) {
        const hash = SecurityService.get_challenge_response(configService.twitterOAuth.appSecret, crc_token);

        response.statusCode = 200;
        response.body = JSON.stringify({
          response_token: "sha256=" + hash,
        });
      } else {
        const message = "crc_token missing from request.";
        response.statusCode = 400;
        response.body = JSON.stringify(message);
        logger.warn(message);
        return response;
      }
    } else if (httpMethod === "POST") {
      // https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/examples.md
      logger.info("Received a POST request.");
      logger.debug(`Event Body: ${event.body}`);

      const body = JSON.parse(event.body) as TweetCreateEvent;
      if (!body || body.user_has_blocked == undefined) {
        const message = "Tweet is not a @mention. Exiting.";
        response.statusCode = 200;
        response.body = JSON.stringify(message);
        logger.warn(message);
        return response;
      }

      const client = new TwitterApi(configService.twitterOAuth);
      const homeTimeline = await client.v1.homeTimeline();

      // Current page is in homeTimeline.tweets
      logger.info(homeTimeline.tweets.length + " fetched.");
    }
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }

  logger.debug(`Response:\n${JSON.stringify(response)}`);
  return response;
}
