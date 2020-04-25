package com.csrg.dsynk.hub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class EventDelegator {

    private Map<String, ExecutorService> executorServiceMap;
    private Map<String, State> stateMap;
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public EventDelegator(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
        this.executorServiceMap = new HashMap<>();
        this.stateMap = new HashMap<>();
    }

    public void initialize(String topic,
                           String from,
                           StateDefinition definition) {

        executorServiceMap.computeIfAbsent(topic, k -> Executors.newSingleThreadExecutor());
        executorServiceMap.get(topic).submit(() -> {
            stateMap.computeIfAbsent(topic, k -> new State());
            stateMap.get(topic).intialize(from, definition);
        });

    }

    public void delegateEvent(String topic,
                              RequestMessage message,
                              String from) {

        executorServiceMap.computeIfAbsent(topic, k -> Executors.newSingleThreadExecutor());
        executorServiceMap.get(topic).submit(() -> {
            stateMap.computeIfAbsent(topic, k -> new State());
            stateMap.get(topic).handleEvent(from, message);
            messagingTemplate.convertAndSend(topic, new Event(from, message));
        });
    }

}
