#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
 
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}


let messages = [];

let Clients = [];
Clients.removeClient = function(_id) {
    for (let i = 0; i < this.length; i++)
    {
        if (this[i].id != _id) continue;
        this.splice(i, 0);
        return true;
    }
    return false;
};
Clients.broadCast = function(_message) {
    for (client of this)
    {
        client.connection.sendUTF(_message);
    }
}


 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    
    let Client = {
        connection: connection,
        id: newId()
    };
    Clients.push(Client);

    for (message of messages) Client.connection.sendUTF(JSON.stringify(message));



    console.log((new Date()) + ' Connection accepted.');
    Client.connection.on('message', function(message) {
        if (message.type !== 'utf8') connection.sendUTF("This encoding is not supported.");
        let messageText = message.utf8Data;
        let newMessage = {
            senderId: Client.id,
            message: messageText
        };
        messages.push(newMessage);

        Clients.broadCast(JSON.stringify(newMessage));
    });
    
    Client.connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        Clients.removeClient(Client.id);
    });
});




function newId() {return parseInt(Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000));}

