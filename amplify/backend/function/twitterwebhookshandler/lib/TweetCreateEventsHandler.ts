import { APIGatewayProxyResultV2 } from "aws-lambda";
import { LoggerService } from "./LoggerService";
import TwitterApi from "twitter-api-v2";
import { TweetCreateEventActivity } from "./types/twitter-types";
import { DataSourceApp, KudosApiClient } from "@slashkudos/kudos-api";
import Utility from "./Utility";

const logger = LoggerService.createLogger();

export default class TweetCreateEventsActivityHandler {
  static async handleIt(
    tweetCreateEventActivity: TweetCreateEventActivity,
    twitterClient: TwitterApi,
    kudosApiClient: KudosApiClient
  ): Promise<APIGatewayProxyResultV2<never>> {
    const appUser = await twitterClient.currentUser();
    const appUserMentionStr = `@${appUser.screen_name}`;
    const tweet = tweetCreateEventActivity.tweet_create_events[0];
    const mentions = tweet.entities.user_mentions.filter((mention) => mention.id !== appUser.id);

    // Skip if the tweet is a reply, or not for the app user, or doesn't start with @appUser
    if (!tweet.text.startsWith(appUserMentionStr) || tweet.in_reply_to_status_id || mentions.length === 0) {
      return Utility.createApiResult("Tweet is not someone giving someone Kudos. Exiting", 200);
    }

    const kudosCache = {};

    for (const mention of mentions) {
      try {
        const { giverUsername, receiverUsername } = { giverUsername: tweet.user.screen_name, receiverUsername: mention.screen_name };
        if (kudosCache[receiverUsername]) continue;
        kudosCache[receiverUsername] = true;

        logger.info("Getting receiver user profile.");
        const receiverProfile = await twitterClient.v2.user(mention.id_str, { "user.fields": ["profile_image_url"] });
        logger.http(JSON.stringify(receiverProfile));

        await kudosApiClient.createKudo({
          giverUsername,
          receiverUsername,
          message: tweet.text,
          tweetId: tweet.id_str,
          giverProfileImageUrl: tweet.user.profile_image_url_https,
          receiverProfileImageUrl: receiverProfile.data.profile_image_url,
          dataSource: DataSourceApp.twitter,
        });

        const kudosCount = await kudosApiClient.getTotalKudosForReceiver(receiverUsername, DataSourceApp.twitter);

        let kudosCountMessage = `You now have ${kudosCount} kudos!`;
        if (kudosCount === 1) {
          kudosCountMessage = `This is your first kudo!`;
        }

        let tweetResponse = `Congrats @${receiverUsername}, you received kudos from @${giverUsername}! ${kudosCountMessage} 🎉 💖`;
        tweetResponse += `\nView your kudos: https://app.slashkudos.com/?search=${receiverUsername}`;

        logger.info(`Replying to tweet (${tweet.id_str}) with "${tweetResponse}"`);

        await twitterClient.v1.reply(tweetResponse, tweet.id_str, { auto_populate_reply_metadata: true });
      } catch (error) {
        logger.error(error.message || error);
      }
    }
    return Utility.createApiResult("Recorded Kudos and responded in a 🧵 on Twitter 🐦", 200);
  }
}
