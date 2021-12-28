#!/usr/bin/env pwsh

<#
    .SYNOPSIS
    Post devcontainer create script to run.

    .DESCRIPTION
    Installs required dev tools and configurations.
#>

[CmdletBinding()]
Param()

# Clone helper twitter account-activity-dashboard tool
gh repo clone twitterdev/account-activity-dashboard /workspaces/twitterdev-account-activity-dashboard
