package com.csrg.dsynk.manager.services.hub;

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
    private Random random;

    public HubService()
    {
        this.hubs = new HashSet<Hub>();
        this.random = new Random();
    }

    public void registerHub(String ip, String port)
    {
        Hub hub = new Hub(ip,port);
        logger.log(Level.INFO, "Hub registration request for : " +  hub.toString());
        if(hubs.contains(hub))
            throw new RuntimeException("Duplicate Hub registration attempted");
        hubs.add(hub);
        logger.log(Level.INFO, "Hubs registered are : " +  hubs.size());
    }

    public Hub assignHub()
    {
        //temp logic for now

        if(hubs.isEmpty())
            throw new RuntimeException("No Hubs registered");

        int randomNumber =  random.nextInt(hubs.size());
        int currentIndex = 0;
        Hub randomHub = null;

        for(Hub hub : hubs)
        {
            randomHub = hub;
            if(currentIndex == randomNumber)
                return randomHub;
            currentIndex++;
        }
        return randomHub;
    }
}
