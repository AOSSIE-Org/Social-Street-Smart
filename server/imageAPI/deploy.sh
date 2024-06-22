#!/bin/sh

# Deploys the API to AWS lambda
# Makes use of packages compiled specifically for Amazon Linix
# Author: Pranav Goyanka

xargs rm -rf <awsPackages.txt
unzip awsPackages.zip
sls deploy
xargs rm -rf <awsPackages.txt