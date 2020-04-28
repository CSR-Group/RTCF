package com.csrg.dsynk.hub.controllers.v1;

import com.csrg.dsynk.hub.controllers.v1.models.CreateStateDto;
import com.csrg.dsynk.hub.controllers.v1.models.EventDto;
import com.csrg.dsynk.hub.controllers.v1.models.GetStateDto;
import com.csrg.dsynk.hub.controllers.v1.models.StateDto;
import com.csrg.dsynk.hub.service.EventDelegator;
import com.csrg.dsynk.hub.service.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.logging.Logger;

@Controller
public class EventController {

    private static final Logger logger = Logger.getLogger(EventController.class.getName());
    public static final String TOPIC = "/topic/client/";

    private EventDelegator delegator;
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public EventController(EventDelegator delegator, SimpMessagingTemplate messagingTemplate) {

        this.delegator = delegator;
        this.messagingTemplate = messagingTemplate;
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

    @MessageMapping("/get")
    public void getCurrentState(GetStateDto getStateDto) {

        logger.info("getstate called with " + getStateDto.getTopic());
        State state = delegator.getState(getStateDto.getTopic());
        logger.info("state " + state.toString());
        StateDto stateDto = new StateDto(state);
        messagingTemplate.convertAndSend(TOPIC + getStateDto.getClientid(), stateDto);
    }


}
