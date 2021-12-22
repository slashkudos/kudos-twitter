// Adapted from https://github.com/twitterdev/account-activity-dashboard/blob/master/helpers/auth.js

const auth = {}

// twitter info
auth.twitter_oauth = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

auth.twitter_webhook_environment = process.env.TWITTER_WEBHOOK_ENV

export default auth
