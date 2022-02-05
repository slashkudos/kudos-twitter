cd amplify/backend/function/twitterwebhookshandler/lib
npm ci
npm run lint
npm run build
cd -

cd amplify/backend/function/twitterwebhookshandler/src
npm ci --production
cd -
