#!/bin/sh

# Fail this script if any subcommand fails.
set -e

# The default execution directory of this script is the ci_scripts directory.
cd $CI_PRIMARY_REPOSITORY_PATH

# Install specific version of Node.js using nvm
brew install nvm
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"
nvm install 18 # or your preferred Node.js version
nvm use 18

# Install Node.js dependencies
npm install --legacy-peer-deps

# Install CocoaPods using Homebrew.
HOMEBREW_NO_AUTO_UPDATE=1
brew install cocoapods

# Install CocoaPods dependencies.
cd ios && pod install

exit 0
