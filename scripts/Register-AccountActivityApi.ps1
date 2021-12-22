#!/usr/bin/env pwsh

<#
    .SYNOPSIS
    Registers a webhook URL for the Account Activity API.

    .DESCRIPTION
    Registers a webhook URL for the Account Activity API.
    See https://developer.twitter.com/en/docs/tutorials/getting-started-with-the-account-activity-api for docs on how to setup the endpoint.
    Requires elevated access.
#>

[CmdletBinding()]
Param(
    [string]$Environment = "production",
    [string]$WebhookUrl = "https://restapi.slashkudos.com/twitter/webhooks",
    [string]$ApiKey = $env:twitter_api_key,
    [string]$AccessToken = $env:twitter_access_token
)

Write-Debug "API Key: $ApiKey"
Write-Debug "Access Token: $AccessToken"

curl --request POST `
 --url "https://api.twitter.com/1.1/account_activity/all/:$Environment/webhooks.json?url=$WebhookUrl" `
 --header "authorization: OAuth oauth_consumer_key=`"$ApiKey`", oauth_nonce=`"GENERATED`", oauth_signature=`"GENERATED`", oauth_signature_method=`"HMAC-SHA1`", oauth_timestamp=`"GENERATED`", oauth_token=`"$AccessToken`", oauth_version=`"1.0`""
