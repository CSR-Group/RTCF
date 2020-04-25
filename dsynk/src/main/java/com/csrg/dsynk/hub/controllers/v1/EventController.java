package com.csrg.dsynk.hub.controllers.v1;

import com.csrg.dsynk.hub.controllers.v1.models.CreateStateDto;
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

    @MessageMapping("/create")
    public void createState(CreateStateDto createStateDto) {

        delegator.initialize(createStateDto.getTopic(),
                             createStateDto.getFrom(),
                             createStateDto.asStateDefinition());
    }

    @MessageMapping("/event")
    public void triggerEvent(EventDto eventDto)  {
        logger.info("Event received for topic : " + eventDto.getTopic()
                + " from : " + eventDto.getFrom()
                + " with message : " + eventDto.getMessage());

        delegator.delegateEvent(eventDto.getTopic(),
                                eventDto.getMessage().asRequestMessage(),
                                eventDto.getFrom());
    }

}
