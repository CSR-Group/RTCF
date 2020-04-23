package com.csrg.dsynk.hub.service;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("server")
public class AppProperties
{
    private String port;

    public String getPort()
    {
        return port;
    }

    public void setPort(String port)
    {
        this.port = port;
    }
}
