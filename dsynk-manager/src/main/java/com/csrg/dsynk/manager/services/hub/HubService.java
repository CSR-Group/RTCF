package com.csrg.dsynk.manager.services.hub;

import com.csrg.dsynk.manager.controller.v1.session.SessionController;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class HubService
{
    Logger logger = Logger.getLogger(HubService.class.getName());

    private Set<Hub> hubs;

    public HubService()
    {
        this.hubs = new HashSet<Hub>();
    }

    public void registerHub(String ip, String port)
    {
        Hub hub = new Hub(ip,port);
        logger.log(Level.INFO, "Hub registration request for : " +  hub.toString());
        if(!hubs.contains(hub))
            hubs.add(hub);
        else
            throw new RuntimeException("Duplicate Hub registration attempted");
    }

    public Hub assignHub()
    {
        Random r = new Random();
        int rno =  r.nextInt(hubs.size());
        int currentIndex = 0;
        Hub randomElement = null;

        for(Hub element : hubs)
        {
            randomElement = element;
            if(currentIndex == rno)
                return randomElement;
            currentIndex++;
        }
        return randomElement;
    }
}
