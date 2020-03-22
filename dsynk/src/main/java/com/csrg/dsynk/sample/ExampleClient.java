package com.csrg.dsynk.sample;

import com.csrg.dsync.sample.Event;
import com.csrg.dsync.sample.SampleTestServerGrpc;
import com.csrg.dsync.sample.State;
import com.csrg.dsync.sample.StateId;
import io.grpc.Channel;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;

import java.util.Iterator;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ExampleClient {

    private static final Logger logger = Logger.getLogger(ExampleClient.class.getName());

    private final SampleTestServerGrpc.SampleTestServerBlockingStub blockingStub;
    private final SampleTestServerGrpc.SampleTestServerStub asyncStub;

    private ExampleClient(Channel channel) {
        blockingStub = SampleTestServerGrpc.newBlockingStub(channel);
        asyncStub = SampleTestServerGrpc.newStub(channel);
    }

    private void getState(int id) {

        StateId request = StateId.newBuilder().setId(123).build();
        logger.log(Level.INFO,"getState called with id: {0}", request.getId());

        try {
            State state = blockingStub.getState(request);
            logger.log(Level.INFO,"State returned: {0}", state.getText());

        } catch (StatusRuntimeException e) {
            logger.log(Level.WARNING,"RPC failed: {0}", e.getStatus());
        }

    }

    private void getEvents(int id) {

        StateId request = StateId.newBuilder().setId(123).build();
        logger.log(Level.INFO,"getEvents called with id: {0}", request.getId());

        try {
            Iterator<Event> events = blockingStub.getEvents(request);
            while (events.hasNext()){
                Event event = events.next();
                logger.log(Level.INFO,"Event returned: {0}", event.getData());
            }

        } catch (StatusRuntimeException e) {
            logger.log(Level.WARNING,"RPC failed: {0}", e.getStatus());
        }

    }

    public static void main(String[] args) throws InterruptedException {

        String target = "localhost:9000";
        ManagedChannel channel = ManagedChannelBuilder.forTarget(target).usePlaintext().build();
        try {
            ExampleClient client = new ExampleClient(channel);

            client.getState(123);

            client.getEvents(423);

        } finally {
            channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
        }
    }

}
