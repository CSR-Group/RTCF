package com.csrg.dsynk.manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class DsynkManager extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(DsynkManager.class, args);
    }
}
