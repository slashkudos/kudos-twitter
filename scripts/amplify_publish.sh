cd amplify/backend/function/twitterwebhookshandler/lib
npm ci
npm run lint
npm run build
cd -

cp amplify/backend/function/twitterwebhookshandler/lib/.npmrc amplify/backend/function/twitterwebhookshandler/src

cd amplify/backend/function/twitterwebhookshandler/src
npm ci --production
cd -
