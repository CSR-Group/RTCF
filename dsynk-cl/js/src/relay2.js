import { Client, Message } from '@stomp/stompjs';

var dsynkHubUrl = "ws://127.0.0.1:8080"

const client = new Client();
client.brokerURL = dsynkHubUrl + "/chat";
console.log(client.brokerURL);

function connect(message) {
    console.log("connecting..");
    client.onConnect = function(frame) {
        // Do something, all subscribes must be done is this callback
        // This is needed because this will be executed after a (re)connect
        console.log("connected..");
        client.subscribe('/topic/messages', function(messageOutput) {
            showMessageOutput(messageOutput.body);
        });
        client.publish({destination: '/app/chat', body: message});
      };
      
    client.onStompError = function (frame) {
    // Will be invoked in case of error encountered at Broker
    // Bad login/passcode typically will cause an error
    // Complaint brokers will set `message` header with a brief message. Body may contain details.
    // Compliant brokers will terminate the connection after any error
    console.log('Broker reported error: ' + frame.headers['message']);
    console.log('Additional details: ' + frame.body);
    };
    
    client.activate();
}

function disconnect() {
    client.deactivate();
}

// async function getState() {
//     const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
//     return await response.json();
// }

function sendMessage(message) {
    if(!client.connected) {
        connect(message);
    } else {
        client.publish({destination: '/app/chat', body: message});
    }

}

function showMessageOutput(messageOutput) {
    console.log(messageOutput);
}

export { sendMessage };
