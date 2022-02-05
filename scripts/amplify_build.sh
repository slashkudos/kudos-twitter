npm ci
echo "Executing npm ci in $(pwd)"

cd amplify/backend/function/twitterwebhookshandler/lib
echo "Executing npm ci, lint and build in $(pwd)"
npm ci
npm run lint
npm run build
cd -

echo "Copying lib/.npmrc into src folder"
cp amplify/backend/function/twitterwebhookshandler/lib/.npmrc amplify/backend/function/twitterwebhookshandler/src

cd amplify/backend/function/twitterwebhookshandler/src
echo "Executing npm ci --production in $(pwd)"
npm ci --production
cd -

amplify status

echo "Done"
