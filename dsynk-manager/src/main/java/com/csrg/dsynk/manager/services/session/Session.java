package com.csrg.dsynk.manager.services.session;

import com.csrg.dsynk.manager.services.hub.Hub;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Session {

    String id;
    String topic;
    Hub hub;
}
