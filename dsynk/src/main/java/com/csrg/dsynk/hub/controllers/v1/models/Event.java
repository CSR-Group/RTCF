package com.csrg.dsynk.hub.controllers.v1.models;

import lombok.Data;

@Data
public class Event {

    private String topic;
    private String message;
    private String from;

}
