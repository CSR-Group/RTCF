import { subscribe, publish, initializeState, getState } from "./relay";
import { State, DataType } from "./state";
import { v4 as uuidv4 } from 'uuid';


var clientID = uuidv4();
var idToSessionMap = {};
var sessionToStateMap = {};

async function createSession(hostAddress) {
    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
        };

    try {
        const sessionInfoResponse = await fetch("http://" + hostAddress + "/session", requestOptions);
        const sessionInfo = await sessionInfoResponse.json();
        idToSessionMap[sessionInfo.id] = sessionInfo;
        return sessionInfo;
    } catch(error) { 
        throw(error);
    }
}

async function createReplicatedObject(hostAddress, definition, onChangeCallback) {
    
    var sessionInfo = await createSession(hostAddress);

    var dsynkHubHost = sessionInfo.hub.ip + ":" + sessionInfo.hub.port;
    var state = new State(definition, clientID, sessionInfo.topic, dsynkHubHost, onChangeCallback);
    var topic = sessionInfo.topic;

    initializeState(dsynkHubHost, topic, clientID, 
                    definition, (message) => state.handle(message));
    sessionToStateMap[sessionInfo.id] = state;
    return [state,sessionInfo.id]; 
}

async function getSession(hostAddress, sessionId) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
        };

    try {
        const sessionInfoResponse = await fetch("http://" + hostAddress + "/session?id=" + sessionId, requestOptions);
        const sessionInfo = await sessionInfoResponse.json();
        idToSessionMap[sessionInfo.id] = sessionInfo;
        return sessionInfo;
    } catch(error) { 
        throw(error);
    }
}

async function sendEvent(sessionId, event, hostAddress) {
    try {
        var sesssionInfo;
        if(!(sessionId in idToSessionMap)) {
            sesssionInfo = await getSession(hostAddress, sessionId);
        } else {
            sesssionInfo = idToSessionMap[sessionId];
        }
        var dsynkHubHost = sessionInfo.hub.ip + ":" + sessionInfo.hub.port;
        publish(dsynkHubHost, sesssionInfo.topic, clientID, event);

    } catch(error) {
        throw(error);
    }
}

async function getReplicatedObject(hostAddress, sessionId,onChangeCallback) {
    var sessionInfo;
    if(!(sessionId in idToSessionMap)) {
        sessionInfo = await getSession(hostAddress, sessionId);
    } else {
        sessionInfo = idToSessionMap[sessionId];
    }
    var dsynkHubHost = sessionInfo.hub.ip + ":" + sessionInfo.hub.port;
    var state = new State({},clientID, sessionInfo.topic, dsynkHubHost,onChangeCallback); 
    sessionToStateMap[sessionInfo.id] = state;
    getState(dsynkHubHost,"/topic/client/"+clientID, (message) => state.buildState(message), 
                            sessionInfo.topic, (message) => state.handle(message), 
                            clientID); 
    return state;
}
// async function joinSession(sessionId,handler) {
//     try {
//         var sesssionInfo;
//         if(!(sessionId in idToSessionMap)) {
//             sesssionInfo = await getSession(sessionId);
//         } else {
//             sesssionInfo = idToSessionMap[sessionId];
//         }
//         var dsynkHubHost = sessionInfo.hub.ip + ":" + sessionInfo.hub.port;
//         subscribe(dsynkHubHost, topic,handler);
//     } catch (error) {
//         throw(error);
//     }
// }

export{createReplicatedObject, getReplicatedObject};
