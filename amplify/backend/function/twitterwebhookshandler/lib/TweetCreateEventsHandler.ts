import { APIGatewayProxyResultV2 } from "aws-lambda";
import { LoggerService } from "./LoggerService";
import TwitterApi, { UserV1 } from "twitter-api-v2";
import { Tweet, TweetCreateEventActivity } from "./types/twitter-types";
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
    const giverScreenName = tweet.user.screen_name;
    const appScreenName = appUser.screen_name;

    // Remove beginning mentions if tweet is a reply (these mentions are added automatically)
    const lastAppMentionIndex = tweet.text.lastIndexOf(`@${appScreenName}`);
    const mentions = tweet.entities.user_mentions.filter((mention) => mention.id !== appUser.id && mention.indices[0] > lastAppMentionIndex);
    const tweetText = tweet.text.substring(lastAppMentionIndex);

    logger.info(`Checking if the tweet "${tweetText}" starts with "@${appScreenName}" and contains mentions.`);
    const isUserGivingKudos =
      tweetText.startsWith(`@${appScreenName}`) && mentions.length > 0 && (!tweet.in_reply_to_status_id || tweet.in_reply_to_user_id !== appUser.id);
    if (!isUserGivingKudos) {
      return Utilities.createApiResult("Tweet is not someone giving someone kudos.", 200);
    }

    await TweetCreateEventsActivityHandler.likeTweet(tweet, appUser, twitterClient);

    const kudosCache = {};

    for (const mention of mentions) {
      try {
        const receiverScreenName = mention.screen_name;
        if (kudosCache[receiverScreenName]) continue;
        kudosCache[receiverScreenName] = true;

        logger.info("Getting receiver user profile.");
        const receiverProfile = await twitterClient.v2.user(mention.id_str, { "user.fields": ["profile_image_url"] });
        logger.http(JSON.stringify(receiverProfile));

        await kudosApiClient.createKudo({
          giverUsername: giverScreenName,
          receiverUsername: receiverScreenName,
          message: tweetText,
          tweetId: tweet.id_str,
          giverProfileImageUrl: tweet.user.profile_image_url_https,
          receiverProfileImageUrl: receiverProfile.data.profile_image_url,
          dataSource: DataSourceApp.twitter,
        });

        await TweetCreateEventsActivityHandler.respondToTweet(kudosApiClient, receiverScreenName, giverScreenName, tweet, twitterClient);
      } catch (error) {
        Utilities.logError(error, `Failed giving kudos to ${mention.screen_name}`);
      }
    }
    return Utilities.createApiResult("Succesfully gave kudos", 200);
  }

  private static async respondToTweet(
    kudosApiClient: KudosApiClient,
    receiverScreenName: string,
    giverScreenName: string,
    tweet: Omit<Tweet, "author_id">,
    twitterClient: TwitterApi
  ): Promise<void> {
    const kudosCount = await kudosApiClient.getTotalKudosForReceiver(receiverScreenName, DataSourceApp.twitter);

    let kudosCountMessage = `You now have ${kudosCount} kudos!`;
    if (kudosCount === 1) {
      kudosCountMessage = `This is your first kudo!`;
    }

    let tweetResponse = `Congrats @${receiverScreenName}, you received kudos from @${giverScreenName}! ${kudosCountMessage} 🎉 💖`;
    tweetResponse += "\nView more kudos: https://app.slashkudos.com";

    logger.info(`Replying to tweet (${tweet.id_str}) with "${tweetResponse}"`);
    await twitterClient.v1.reply(tweetResponse, tweet.id_str, { auto_populate_reply_metadata: true });
  }

  private static async likeTweet(tweet: Omit<Tweet, "author_id">, appUser: UserV1, twitterClient: TwitterApi): Promise<void> {
    try {
      if (tweet.user.id !== appUser.id) {
        logger.info("Liking the tweet.");
        await twitterClient.v2.like(appUser.id_str, tweet.id_str);
      }
    } catch (error) {
      Utilities.logError(error, "Error liking the tweet.");
    }
  }
}
