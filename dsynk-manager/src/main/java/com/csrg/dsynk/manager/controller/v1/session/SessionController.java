package com.csrg.dsynk.manager.controller.v1.session;

import com.csrg.dsynk.manager.controller.v1.session.model.SessionMeta;
import com.csrg.dsynk.manager.services.session.Session;
import com.csrg.dsynk.manager.services.session.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
public class SessionController {

    Logger logger = Logger.getLogger(SessionController.class.getName());

    private SessionService sessionService;

    @Autowired
    public SessionController(SessionService sessionService) {

        this.sessionService = sessionService;
    }

    @PostMapping("/session")
    public SessionMeta createSession() {

        logger.log(Level.INFO, "Create session called");
        Session session = sessionService.createSession();
        SessionMeta sessionMeta = new SessionMeta(session);
        logger.log(Level.INFO, "Create session returned with" + sessionMeta.toString());
        return sessionMeta;
    }

    @GetMapping("/session")
    public SessionMeta getSession(String id) {

        logger.log(Level.INFO, "Get session called with id: " + id);
        Session session = sessionService.getSession(id)
                                        .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        SessionMeta sessionMeta = new SessionMeta(session);
        logger.log(Level.INFO, "Get session returned with" + sessionMeta.toString());
        return sessionMeta;
    }
}
