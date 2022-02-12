#!/usr/bin/env pwsh

<#
    .SYNOPSIS
    Post devcontainer create script to run.

    .DESCRIPTION
    Installs required dev tools and configurations.
#>

[CmdletBinding()]
Param()

# https://github.com/twitter/twurl
gem install twurl

echo @"
progress=true
email=$(git config --get user.email)
@slashkudos:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=$env:GITHUB_TOKEN
"@ > ~/.npmrc
