import { components } from "./twitter-openapi";

export type Tweet = components["schemas"]["Tweet"];
export type User = components["schemas"]["User"];

export interface TweetCreateEventActivity {
  for_user_id: string;
  user_has_blocked?: boolean;
  tweet_create_events: Tweet[];
}
export interface FollowEventActivity {
  for_user_id: string;
  follow_events: FollowEvent[];
}

export interface FollowEvent {
  type: "follow" | "unfollow";
  created_timestamp: string;
  target: Omit<User, "id" | "id_str"> & {
    id: string;
  };
  source: Omit<User, "id" | "id_str"> & {
    id: string;
  };
}

export type ActivityEvent = TweetCreateEventActivity & FollowEventActivity;
