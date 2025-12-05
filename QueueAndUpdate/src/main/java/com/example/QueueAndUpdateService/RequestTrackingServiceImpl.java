package com.example.QueueAndUpdateService;

import com.example.QueueAndUpdateService.grpc.AdminRequestWatcherServiceGrpc;
import com.example.QueueAndUpdateService.grpc.RequestStatusRequest;
import com.example.QueueAndUpdateService.grpc.RequestStatusUpdate;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class RequestTrackingServiceImpl
        extends AdminRequestWatcherServiceGrpc.AdminRequestWatcherServiceImplBase {

    private final AdminRequestRestClient restClient;

    @Override
    public void streamRequestStatus(
            RequestStatusRequest request,
            StreamObserver<RequestStatusUpdate> responseObserver) {

        Long requestId = request.getRequestId();

        try {
            // Fetch initial status
            AdminRequestStatusDTO previous = restClient.getRequestById(requestId);

            // Send initial status
            sendStatus(responseObserver, previous);

            while (true) {
                Thread.sleep(1000); // Poll interval

                AdminRequestStatusDTO current = restClient.getRequestById(requestId);

                // Only send when status changed or type changed
                if (!current.getStatus().equals(previous.getStatus())) {

                    sendStatus(responseObserver, current);
                    previous = current;
                }
            }

        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }

    private void sendStatus(StreamObserver<RequestStatusUpdate> responseObserver,
                            AdminRequestStatusDTO dto) {

        RequestStatusUpdate update = RequestStatusUpdate.newBuilder()
                .setId(dto.getId())
                .setType(dto.getType())
                .setStatus(dto.getStatus())
                .build();

        responseObserver.onNext(update);
    }
}
