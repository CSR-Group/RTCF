import { Client, Message } from '@stomp/stompjs';

var dsynkHubUrl = "ws://127.0.0.1:8082"

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

function publish(topic, from, message) {
    var eventMessage = JSON.stringify({'topic' : topic, 
                                       'from' : from,
                                       'message': message });
    console.log("sending event : " + eventMessage);
    if(!client.connected) {
        var onConnect = function() {
            client.publish({destination: "/event/trigger", body: eventMessage});
        }
        connect(onConnect);
    }
    else {
        client.publish({destination: "/event/trigger", body: eventMessage});
    }
}

export { subscribe, publish }; 
