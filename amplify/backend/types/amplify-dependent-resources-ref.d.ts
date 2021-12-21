export type AmplifyDependentResourcesAttributes = {
    "function": {
        "twitterwebhookshandler": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "auth": {
        "kudostwitter": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "api": {
        "twitter": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}