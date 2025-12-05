package com.example.QueueAndUpdateService;


import com.example.QueueAndUpdateService.grpc.*;
import io.grpc.stub.ServerCallStreamObserver;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.*;

@GrpcService
public class QueueServiceImpl extends QueueServiceGrpc.QueueServiceImplBase {

    @Autowired
    private final RedisQueueManager queueManager;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);

    public QueueServiceImpl(RedisQueueManager queueManager) {
        this.queueManager = queueManager;
    }

    @Override
    public void joinQueue(JoinQueueRequest request, StreamObserver<JoinQueueResponse> responseObserver) {
        String serviceId = request.getServiceId();
        String locationId = request.getLocationId();
        String userId = request.getUserId();

        int position = queueManager.joinQueue(serviceId, locationId, userId);
        Map<String, String> stats = queueManager.getStats(serviceId, locationId);
        JoinQueueResponse resp = JoinQueueResponse.newBuilder()
                .setSuccess(true)
                .setPosition(position)
                .setWaiting(Integer.parseInt(stats.getOrDefault("waiting", "0")))
                .setMessage("Joined queue")
                .build();
        responseObserver.onNext(resp);
        responseObserver.onCompleted();
    }

    @Override
    public void leaveQueue(LeaveQueueRequest request, StreamObserver<LeaveQueueResponse> responseObserver) {
        boolean removed = queueManager.leaveQueue(request.getServiceId(), request.getLocationId(), request.getUserId());
        Map<String, String> stats = queueManager.getStats(request.getServiceId(), request.getLocationId());

        LeaveQueueResponse resp = LeaveQueueResponse.newBuilder()
                .setSuccess(removed)
                .setWaiting(Integer.parseInt(stats.getOrDefault("waiting", "0")))
                .setMessage(removed ? "Left queue" : "User was not in queue")
                .build();
        responseObserver.onNext(resp);
        responseObserver.onCompleted();
    }

    @Override
    public void getPosition(GetPositionRequest request, StreamObserver<GetPositionResponse> responseObserver) {
        int pos = queueManager.getPosition(request.getServiceId(), request.getLocationId(), request.getUserId());
        Map<String, String> stats = queueManager.getStats(request.getServiceId(), request.getLocationId());
        boolean inQueue = pos > 0;
        GetPositionResponse resp = GetPositionResponse.newBuilder()
                .setInQueue(inQueue)
                .setPosition(inQueue ? pos : 0)
                .setWaiting(Integer.parseInt(stats.getOrDefault("waiting", "0")))
                .setMessage(inQueue ? "In queue" : "Not in queue")
                .build();
        responseObserver.onNext(resp);
        responseObserver.onCompleted();
    }

    @Override
    public void streamQueueStatus(QueueStatusRequest request, StreamObserver<QueueStatusResponse> responseObserver) {

        ServerCallStreamObserver<QueueStatusResponse> serverObserver =
                (ServerCallStreamObserver<QueueStatusResponse>) responseObserver;

        String serviceId = request.getServiceId();
        String locationId = request.getLocationId();
        String userId = request.getUserId();

        serverObserver.setOnCancelHandler(() -> {
            System.out.println("Client cancelled streaming for user: " + userId);
        });

        // Store previous state to detect changes
        final int[] prevPosition = {-1};
        final int[] prevWaiting = {-1};

        scheduler.scheduleAtFixedRate(() -> {

            if (serverObserver.isCancelled()) {
                return; // stop sending updates
            }

            try {
                Map<String, String> stats = queueManager.getStats(serviceId, locationId);
                int waiting = Integer.parseInt(stats.getOrDefault("waiting", "0"));
                int position = (userId == null || userId.isEmpty())
                        ? 0
                        : queueManager.getPosition(serviceId, locationId, userId);

                if (position != prevPosition[0] || waiting != prevWaiting[0]) {

                    QueueStatusResponse resp = QueueStatusResponse.newBuilder()
                            .setUserId(userId == null ? "" : userId)
                            .setPosition(position)
                            .setWaiting(waiting)
                            .setEvent("stats")
                            .setDetail("update")
                            .setUpdatedAt(Instant.now().toString())
                            .build();

                    serverObserver.onNext(resp);

                    // Update previous state
                    prevPosition[0] = position;
                    prevWaiting[0] = waiting;
                }

            } catch (Exception e) {
                serverObserver.onError(e);
            }

        }, 0, 2, TimeUnit.SECONDS); // polling every 2s
    }
}

