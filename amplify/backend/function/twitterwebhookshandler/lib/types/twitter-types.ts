import { components } from "./twitter-openapi";

export type Tweet = components["schemas"]["Tweet"];
export interface TweetCreateEvent {
  for_user_id: string;
  user_has_blocked?: boolean;
  tweet_create_events: Tweet[];
}
