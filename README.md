# DynamoDB for NodeRED

[![RedConnect Approved](https://img.shields.io/badge/RedConnect-Approved-brightgreen.svg?style=flat)](https://www.redconnect.io/addons/dynamodb/)

An set of nodes that wrap the DynamoDB functions in the [AWS-SDK](https://eu-west-1.console.aws.amazon.com/dynamodb/home).

## Installation

`npm i node-red-contrib-dynamodb --save`

## Quick Start

You will need a user setup in IAM that has the following user policy/permissions:

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AccessDynamoDBStreamOnly",
                "Effect": "Allow",
                "Action": [
                    "dynamodb:DescribeStream",
                    "dynamodb:GetRecords",
                    "dynamodb:GetShardIterator",
                    "dynamodb:ListStreams"
                ],
                "Resource": "arn:aws:dynamodb:eu-west-1:952427577739:table/example/stream/*"
            }
        ]
    }

You will then need to provide the AccessKey, SecretAccessKey and Region in the configuration node to connect. 

## Implemented Nodes

 * Stream Node