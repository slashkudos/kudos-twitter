import { APIGatewayEvent } from "aws-lambda";
import { ConfigService } from "./ConfigService";
import { SecurityService } from "./SecurityService";

// ANY http method to /webhooks will come here
// See issue: https://github.com/aws-amplify/amplify-cli/issues/1232
// API Gateway Event format: https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html#apigateway-example-event
export async function handler(event: APIGatewayEvent) {
  const httpMethod = event.httpMethod;
  const response = {
    statusCode: 404,
    body: JSON.stringify(`Received an unhandled ${httpMethod} request`),
  };

  const configService = await ConfigService.build();

  // Return crc token
  if (httpMethod === "GET") {
    const crc_token = event?.queryStringParameters?.crc_token;

    if (crc_token) {
      const hash = SecurityService.get_challenge_response(configService.twitterOAuth.apiSecret, crc_token);

      response.statusCode = 200;
      response.body = JSON.stringify({
        response_token: "sha256=" + hash,
      });
    } else {
      response.statusCode = 400;
      response.body = JSON.stringify("Error: crc_token missing from request.");
    }
  }

  return response;
}
