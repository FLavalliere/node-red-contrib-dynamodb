var aws = require('aws-sdk'),
    schedule = require('tempus-fugit').schedule,
    DynamoDBStream = require('dynamodb-stream');


module.exports = function(RED) {
    'use strict';

    function Node(n) {
      
        RED.nodes.createNode(this,n);

        var node = this;
        
        var config = RED.nodes.getNode(n.aws);
        
        if (!config.accessKey || !config.secretAccessKey || !config.region ) {
            node.error('AWS Not Configured');
            return;
        }
        
        aws.config.update({ 
            accessKeyId: config.accessKey,
            secretAccessKey: config.secretAccessKey,
            region: config.region 
        });
    
        var ddb = new aws.DynamoDB();
        var ddbStream = new DynamoDBStream(new aws.DynamoDBStreams(), n.arn);
        
        // fetch stream state initially
        ddbStream.fetchStreamState(function (err) {
            if (err) {
                console.error(err)
                return process.exit(1)
            }
            console.log('AWS Connected');  
            
            // do this every 1 minute, starting from the next round minute
            schedule({ minute: 1 }, function (job) {
                ddbStream.fetchStreamState(job.callback())
            })
        });
        
        var sendData = function (topic, payload) {
            
            console.log(topic, payload);
            
            var msg = {
                topic: topic,
                payload: payload
            };
            node.send(msg);
        };

        ddbStream.on('insert record', function (data) {
            console.log(data);
            sendData('insert record', data);
        });

        ddbStream.on('remove record', function (data) {
            sendData('remove record', data);
        });

        ddbStream.on('modify record', function (newData, oldData) {
            
            var topic = 'modify record';
            var payload = {
                old: oldData,
                new: newData
            };
            sendData(topic, payload);
        })

        ddbStream.on('new shards', function (shardIds) {
            console.log(shardIds);
        });
        ddbStream.on('remove shards', function (shardIds) {
             console.log(shardIds);
        });
        
    }

    RED.nodes.registerType('dynamodb-stream', Node);
};
