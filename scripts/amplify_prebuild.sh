# Exit immediately if a command exits with a non-zero status.
set -e

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ROOT_DIR=$SCRIPT_DIR/..
FUNCTION_DIR=amplify/backend/function/twitterwebhookshandler

cd $ROOT_DIR
echo "Executing npm ci in $(pwd)"
npm ci

cd $ROOT_DIR/$FUNCTION_DIR/lib
echo "Executing npm ci, lint and build in $(pwd)"
npm ci
npm run lint
npm run build
cd -

echo "Copying lib/.npmrc into src folder"
cp $ROOT_DIR/$FUNCTION_DIR/lib/.npmrc $ROOT_DIR/$FUNCTION_DIR/src

cd $ROOT_DIR/$FUNCTION_DIR/src
echo "Executing npm ci --production in $(pwd)"
npm ci --production
cd -

echo "Done"
