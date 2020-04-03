package com.csrg.dsynk.hub.sample;

import com.csrg.dsync.sample.Event;
import com.csrg.dsync.sample.SampleTestServerGrpc;
import com.csrg.dsync.sample.State;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ExampleService extends SampleTestServerGrpc.SampleTestServerImplBase {

    private static final Logger logger = Logger.getLogger(ExampleService.class.getName());

    /**
     */
    public void getState(com.csrg.dsync.sample.StateId request,
                         io.grpc.stub.StreamObserver<com.csrg.dsync.sample.State> responseObserver) {

        logger.log(Level.INFO, "getState called : {0}", request.getId());

        State response = State.newBuilder()
                .setText("Hello world : " + request.getId())
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    /**
     */
    public void getEvents(com.csrg.dsync.sample.StateId request,
                          io.grpc.stub.StreamObserver<com.csrg.dsync.sample.Event> responseObserver) {

        logger.log(Level.INFO, "getEvents called : {0}", request.getId());

        List<Event> responseStream = new ArrayList<>();
        responseStream.add(Event.newBuilder().setData("Event A").build());
        responseStream.add(Event.newBuilder().setData("Event B").build());
        responseStream.add(Event.newBuilder().setData("Event C").build());
        responseStream.add(Event.newBuilder().setData("Event D").build());
        responseStream.add(Event.newBuilder().setData("Event E").build());

        for(Event event : responseStream) {
            responseObserver.onNext(event);
        }
        responseObserver.onCompleted();
    }

}
