package com.csrg.dsynk.hub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@Component
public class HubService
{
    Logger logger = Logger.getLogger(HubService.class.getName());
    RestTemplate restTemplate;
    String dsynkManagerUrl = "http://localhost:9090";
    String ip;
    String port;

    @Autowired
    AppProperties appProperties;

    public HubService()
    {
        this.restTemplate  = new RestTemplate();
    }

    @PostConstruct
    private void init() throws UnknownHostException
    {
        this.ip = InetAddress.getLocalHost().getHostAddress();
        this.port = appProperties.getPort();
        logger.log(Level.INFO, "Hub Details- IP: " + this.ip + ", Port: " + this.port);
        registerHub();
    }

    public void registerHub()
    {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("ip", this.ip);
        requestBody.put("port", this.port);

        ResponseEntity<Void> response = restTemplate.postForEntity(dsynkManagerUrl + "/hub", requestBody, Void.class);
        if (response.getStatusCode() == HttpStatus.OK)
        {
            logger.log(Level.INFO, "Hub Registered- IP: " + this.ip + ", Port: " + this.port);
        }
        else
        {
            logger.log(Level.INFO, "Error in hub registration");
        }
    }
}
