package com.csrg.dsynk.hub.controllers.v1;

import com.csrg.dsynk.hub.controllers.v1.models.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.logging.Logger;

@Controller
public class EventController {

    private static final Logger logger = Logger.getLogger(EventController.class.getName());

    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public EventController(SimpMessagingTemplate messagingTemplate) {

        this.messagingTemplate = messagingTemplate;
    }


    @MessageMapping("/trigger")
    public void triggerEvent(Event event) throws Exception {
        logger.info("Event received for topic : " + event.getTopic()
                + " from : " + event.getFrom()
                + " with message : " + event.getMessage());

        messagingTemplate.convertAndSend(event.getTopic(), event);
    }

}
