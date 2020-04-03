package com.csrg.dsynk.hub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class DSynkHub extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(DSynkHub.class, args);
    }
}
