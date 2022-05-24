import { APIGatewayProxyResultV2 } from "aws-lambda";
import { LoggerService } from "./LoggerService";
import TwitterApi from "twitter-api-v2";
import { FollowEventActivity } from "./types/twitter-types";
import Utilities from "./Utilities";

const logger = LoggerService.createLogger();

export default class FollowEventsHandler {
  static async handleIt(followEventActivity: FollowEventActivity, twitterClient: TwitterApi): Promise<APIGatewayProxyResultV2<never>> {
    const appUser = await twitterClient.currentUser();
    const followEvent = followEventActivity.follow_events[0];

    // Skip if this is not someone following the app
    const isUserFollowingApp = followEvent.type === "follow" && followEvent.target.id === appUser.id_str;
    if (!isUserFollowingApp) {
      return Utilities.createApiResult("This user is not following the app. Exiting", 200);
    }

    // Give kudos to the user!
    const kudosMessage = `@${appUser.screen_name} Thanks @${followEvent.source.screen_name} for the follow! Now go, spread kudos! ❤️🥰`;
    logger.info(`Creating tweet "${kudosMessage}"`);
    await twitterClient.v1.tweet(kudosMessage, { auto_populate_reply_metadata: true });

    try {
      // Follow the user back
      logger.info(`Following the user back`);
      await twitterClient.v2.follow(appUser.id_str, followEvent.source.id);
    } catch (error) {
      logger.error(`Failed to follow the user back: ${error.message || error}`);
    }

    return Utilities.createApiResult("Gave the follower kudos and followed them back!", 200);
  }
}
