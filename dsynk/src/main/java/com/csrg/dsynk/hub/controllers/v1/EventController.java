package com.csrg.dsynk.hub.controllers.v1;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class EventController {

    @MessageMapping("/session")
    @SendTo("/topic/messages")
    public String send(String message) throws Exception {
        System.out.println("Connected with message" + message);
        return "{ Hello World: " + message + " }";
    }

}
