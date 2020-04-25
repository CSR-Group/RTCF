package com.csrg.dsynk.hub.service;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Event {

    String from;
    requestMessage message;
}
