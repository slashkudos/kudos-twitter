#!/bin/bash

amplify_env=$1
amplify_appId=$2

if [ -z "$amplify_env" ]; then
    echo "You must provide amplify_env input parameter in order to deploy"
    exit 1
fi

if [ -z "$amplify_appId" ]; then
    echo "You must provide amplify_appId input parameter in order to deploy"
    exit 1
fi

if [ -z "$(amplify env get --name $amplify_env | grep 'No environment found')" ]; then
    echo "Pulling $amplify_env ($amplify_appId)"
    rm -rf amplify-temp
    cp -r amplify amplify-temp

    amplify pull --appId $amplify_appId --envName $amplify_env --yes

    cp -r amplify-temp/* amplify
    rm -rf amplify-temp

    status=$?
    exit $status
else
    echo "$amplify_env environment does not exist"
    exit 1
fi
