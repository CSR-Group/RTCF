package com.csrg.dsynk.hub.controllers.v1.models;

import com.csrg.dsynk.hub.service.requestMessage;
import lombok.Data;

@Data
public class EventDto {

    private String topic;
    private requestMessage message;
    private String from;
}
