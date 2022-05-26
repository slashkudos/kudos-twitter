# slashkudos Twitter

The slashkudos Twitter integration.

- [Developer Dashboard](https://developer.twitter.com/en/portal/dashboard)
- [Getting started with the Account Activity API](https://developer.twitter.com/en/docs/tutorials/getting-started-with-the-account-activity-api)
  - [Elevated access is required](https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api#Access)
  - [Initial Setup using account-activity-dashboard](https://github.com/twitterdev/account-activity-dashboard)
- [node-twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2)

## Endpoints

| Endpoint | Description | Stage |
| -------- | ----------- | ----- |
| <https://restapi.slashkudos.com> | Base URL | Prod |
| <https://restapi.slashkudos.com/twitter> | Twitter Resources | Prod |

## Testing using awscurl

You can use awscurl to hit the API endpoints for simple tests.

```bash
awscurl --service execute-api https://restapi.slashkudos.com/twitter/webhooks
```
