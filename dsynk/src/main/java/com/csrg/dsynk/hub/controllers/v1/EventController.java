package com.csrg.dsynk.hub.controllers.v1;

import com.csrg.dsynk.hub.controllers.v1.models.EventDto;
import com.csrg.dsynk.hub.service.EventDelegator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.util.logging.Logger;

@Controller
public class EventController {

    private static final Logger logger = Logger.getLogger(EventController.class.getName());

    private EventDelegator delegator;

    @Autowired
    public EventController(EventDelegator delegator) {

        this.delegator = delegator;
    }


    @MessageMapping("/trigger")
    public void triggerEvent(EventDto eventDto) throws Exception {
        logger.info("Event received for topic : " + eventDto.getTopic()
                + " from : " + eventDto.getFrom()
                + " with message : " + eventDto.getMessage());

        delegator.delegate(eventDto.getTopic(), eventDto.getMessage(), eventDto.getFrom());
    }

}
