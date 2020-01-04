var WebSocketClient = require('websocket').client
var client = new WebSocketClient();


client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Arrived: '" + message.utf8Data + "'");
        }
    });

    
    function sendNumber() {
        if (connection.connected) {
            connection.sendUTF("Hi there Neo!");
            console.log("Send:");
        }
    }
    sendNumber();
    setTimeout(sendNumber, 5000);
});
 
client.connect('ws://206.83.41.24:8080/', 'echo-protocol');
