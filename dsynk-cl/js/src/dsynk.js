import { subscribe, publish } from "./relay";

var idToTopicMap = {};

async function createSession(hostAddress) {
    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
        };

    try {
        const sessionInfoResponse = await fetch("http://" + hostAddress + "/session", requestOptions);
        console.log(sessionInfoResponse.body);
        const sessionInfo = await sessionInfoResponse.json();
        idToTopicMap[sessionInfo.id] = sessionInfo.topic;
        return sessionInfo;
    } catch(error) { 
        throw(error);
    }
}

async function getSession(hostAddress, sessionId) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
        };

    try {
        const sessionInfoResponse = await fetch("http://" + hostAddress + "/session?id=" + sessionId, requestOptions);
        console.log(sessionInfoResponse);
        const sessionInfo = await sessionInfoResponse.json();
        idToTopicMap[sessionInfo.id] = sessionInfo.topic;
        return sessionInfo;
    } catch(error) { 
        throw(error);
    }
}

async function sendEvent(sessionId, event) {
    try {
        if(!(sessionId in idToTopicMap)) {
            const sesssionInfo = await getSession(sessionId);
            publish(sesssionInfo.topic, event);
        } else {
            publish(idToTopicMap[sessionId], event);
        }
    } catch(error) {
        throw(error);
    }
}

function joinSession(topic,handler) {
    try {
        subscribe(topic,handler);
    } catch (error) {
        throw(error);
    }
}

export{createSession, getSession, joinSession, sendEvent};
