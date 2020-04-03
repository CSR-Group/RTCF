package com.csrg.dsynk.manager.controller.v1.session.model;

import com.csrg.dsynk.manager.services.session.Session;
import lombok.Data;

@Data
public class SessionMeta {

    String id;
    String topic;

    public SessionMeta(Session session) {

        this.id = session.getId();
        this.topic = session.getTopic();
    }
}
