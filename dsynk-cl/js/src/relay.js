import { Client, Message } from '@stomp/stompjs';

var dsynkHubUrl = "ws://127.0.0.1:8080"

const client = new Client();
client.brokerURL = dsynkHubUrl + "/session";

function connect(onConnect) {
    console.log("connecting..");
    client.onConnect = function(frame) {
        console.log("connected..");
        onConnect();
      };      
    client.onStompError = function (frame) {
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
    };
    
    client.activate();
}

function disconnect() {
    client.deactivate();
}

function subscribe(topic, handler) {
    if(!client.connected) {
        var onConnect = function() {
            client.subscribe(topic,handler);
        }
        connect(onConnect);
    }
    else {
        client.subscribe(topic,handler);
    }
}

function publish(topic, message) {
    if(!client.connected) {
        var onConnect = function() {
            client.publish({destination: topic, body: message});
        }
        connect(onConnect);
    }
    else {
        client.publish({destination: topic, body: message});
    }
}

export { subscribe, publish }; 
