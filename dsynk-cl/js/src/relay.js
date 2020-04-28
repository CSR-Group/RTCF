import { Client, Message } from '@stomp/stompjs';

const client = new Client();

async function connect(onConnect, dsynkHubHost) {
    client.brokerURL = "ws://" + dsynkHubHost + "/session";
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

async function subscribe(dsynkHubHost, topic, handler) {
    await connectAndDo(dsynkHubHost, () => client.subscribe(topic,handler));
}

async function publish(dsynkHubHost, topic, from, message) {
    var eventMessage = JSON.stringify({'topic' : topic, 
                                       'from' : from,
                                       'message': message });
    console.log("sending event : " + eventMessage);
    await connectAndDo(dsynkHubHost, () => client.publish({destination: "/state/event", body: eventMessage})); 
}

async function initializeState(dsynkHubHost, topic, from, stateDefinition, eventHandler) {
    
    console.log("initialize state : " + stateDefinition);

    var message = JSON.stringify({'topic' : topic, 
                                  'from' : from,
                                  'variables': stateDefinition });
    await connectAndDo(dsynkHubHost, () => {
        client.publish({destination: "/state/create", body: message});
        client.subscribe(topic, eventHandler);
    }); 
}

async function getState(dsynkHubHost, mgmtTopic, mgmtHandler, sessionTopic, eventHandler, clientID) {
    await connectAndDo(dsynkHubHost, () => {
        client.subscribe(sessionTopic, eventHandler);
        client.subscribe(mgmtTopic, mgmtHandler);
        var message = JSON.stringify({'topic' : sessionTopic, 
                                      'clientid' : clientID});
        client.publish({destination: "/state/get", body: message});
    }); 
}

async function connectAndDo(dsynkHubHost, action) {

    if(!client.connected) {
        var onConnect = function() {
            action();
        }
        await connect(onConnect, dsynkHubHost);
    }
    else {
        action();
    }
}

export { subscribe, publish, initializeState, getState}; 
