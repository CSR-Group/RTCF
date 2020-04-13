package com.csrg.dsynk.manager.controller.v1.hub;

import com.csrg.dsynk.manager.controller.v1.hub.model.HubRegistrationRequest;
import com.csrg.dsynk.manager.services.hub.HubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
public class HubController
{
    Logger logger = Logger.getLogger(HubController.class.getName());

    private HubService hubService;

    @Autowired
    public HubController(HubService hubService) {
        this.hubService = hubService;
    }

    @PostMapping("/hub")
    public void registerHub(@RequestBody HubRegistrationRequest registrationRequest) {

        logger.log(Level.INFO, "Register Hub called with - "
                    + registrationRequest.getIp() + " : " + registrationRequest.getPort());
        hubService.registerHub(registrationRequest.getIp(), registrationRequest.getPort());
        logger.log(Level.INFO, "Hub Registered");
    }
}
