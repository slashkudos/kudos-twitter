#!/usr/bin/env pwsh

<#
    .SYNOPSIS
    Registers a webhook URL and subscribes to all events for the Account Activity API.

    .DESCRIPTION
    Registers a webhook URL for the Account Activity API.
    See https://developer.twitter.com/en/docs/tutorials/getting-started-with-the-account-activity-api for docs on how to setup the endpoint.
#>

[CmdletBinding()]
Param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey,

    [Parameter(Mandatory=$true)]
    [string]$ApiSecret,

    [Parameter(Mandatory=$true)]
    [string]$AccessToken,

    [string]$Environment = "production",
    [string]$WebhookUrl = "https://restapi.slashkudos.com/twitter/webhooks"
)

if (-not $ApiKey) {
    throw "API Key is required"
}
if (-not $ApiSecret) {
    throw "API Secret is required"
}
if (-not $AccessToken) {
    throw "Access Token is required"
}

twurl authorize --bearer --consumer-key $ApiKey --consumer-secret $ApiSecret

Write-Host "Webhooks before..."
twurl /1.1/account_activity/all/webhooks.json

Write-Host "`nRegistering the webhook (/1.1/account_activity/all/$Environment/webhooks.json?url=$WebhookUrl)..."
twurl -X POST "/1.1/account_activity/all/$Environment/webhooks.json?url=$WebhookUrl"

Write-Host "`nWebhooks after..."
twurl /1.1/account_activity/all/webhooks.json

$webhookId = Read-Host "`nPlease enter the webhook id to validate"

Write-Host "Validating webhook.."
twurl -X PUT "/1.1/account_activity/all/$Environment/webhooks/$webhookId.json"

Write-Host "Creating a subscription for the webhook (/1.1/account_activity/all/$Environment/subscriptions.json)..."
twurl -X POST "/1.1/account_activity/all/$Environment/subscriptions.json"

Write-Host "`nListing the current All Activity type subscriptions..."
twurl --bearer "/1.1/account_activity/all/$Environment/subscriptions/list.json"
