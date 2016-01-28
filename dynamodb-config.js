module.exports = function(RED) {
    function RemoteServerNode(n) {
        RED.nodes.createNode(this,n);
        this.accessKey = n.accessKey;
        this.secretAccessKey = n.secretAccessKey;
        this.region = n.region;
    }
    RED.nodes.registerType("dynamodb-config", RemoteServerNode);
}
