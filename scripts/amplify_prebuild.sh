npm ci
echo "Executing npm ci in $(pwd)"

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ROOT_DIR=$SCRIPT_DIR/..

cd $ROOT_DIR/amplify/backend/function/twitterwebhookshandler/lib
echo "Executing npm ci, lint and build in $(pwd)"
npm ci
npm run lint
npm run build
cd -

echo "Copying lib/.npmrc into src folder"
cp $ROOT_DIR/amplify/backend/function/twitterwebhookshandler/lib/.npmrc $ROOT_DIR/amplify/backend/function/twitterwebhookshandler/src

cd $ROOT_DIR/amplify/backend/function/twitterwebhookshandler/src
echo "Executing npm ci --production in $(pwd)"
npm ci --production
cd -

if command -v amplify &>/dev/null; then
  amplify status | grep -v "GraphQL API KEY"
fi

echo "Done"
