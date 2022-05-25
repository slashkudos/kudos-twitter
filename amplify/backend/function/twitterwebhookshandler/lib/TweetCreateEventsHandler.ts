import { APIGatewayProxyResultV2 } from "aws-lambda";
import { LoggerService } from "./LoggerService";
import TwitterApi from "twitter-api-v2";
import { TweetCreateEventActivity } from "./types/twitter-types";
import { DataSourceApp, KudosApiClient } from "@slashkudos/kudos-api";
import Utilities from "./Utilities";

const logger = LoggerService.createLogger();

export default class TweetCreateEventsActivityHandler {
  static async handleIt(
    tweetCreateEventActivity: TweetCreateEventActivity,
    twitterClient: TwitterApi,
    kudosApiClient: KudosApiClient
  ): Promise<APIGatewayProxyResultV2<never>> {
    const appUser = await twitterClient.currentUser();
    const tweet = tweetCreateEventActivity.tweet_create_events[0];

    // Remove beginning mentions if tweet is a reply (these mentions are added automatically)
    const lastAppMentionIndex = tweet.text.lastIndexOf(`@${appUser.screen_name}`);
    const mentions = tweet.entities.user_mentions.filter((mention) => mention.id !== appUser.id && mention.indices[0] > lastAppMentionIndex);
    const tweetText = tweet.text.substring(lastAppMentionIndex);

    logger.info(`Checking if the tweet "${tweetText}" starts with "@${appUser.screen_name}" and contains mentions.`);
    const isUserGivingKudos =
      tweetText.startsWith(`@${appUser.screen_name}`) && mentions.length > 0 && (!tweet.in_reply_to_status_id || tweet.in_reply_to_user_id !== appUser.id);
    if (!isUserGivingKudos) {
      return Utilities.createApiResult("Tweet is not someone giving someone kudos.", 200);
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
          message: tweetText,
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
        Utilities.logError(error, `Failed giving kudos to ${mention.screen_name}`);
      }
    }
    try {
      // Don't be a weirdo and like your own tweet
      if (tweet.user.id !== appUser.id) {
        logger.info("Liking the tweet.");
        await twitterClient.v2.like(appUser.id_str, tweet.id_str);
      }
    } catch (error) {
      Utilities.logError(error, "Error liking the tweet.");
    }
    return Utilities.createApiResult("Succesfully gave kudos", 200);
  }
}
