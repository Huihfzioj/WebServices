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
    public void streamRequestStatus(RequestStatusRequest request,
                                    StreamObserver<RequestStatusUpdate> responseObserver) {

        Long requestId = request.getRequestId();

        try {
            while (true) {
                AdminRequestStatusDTO statusDTO = restClient.getRequestById(requestId);

                RequestStatusUpdate update = RequestStatusUpdate.newBuilder()
                        .setId(statusDTO.getId())
                        .setType(statusDTO.getType())
                        .setStatus(statusDTO.getStatus())
                        .build();

                responseObserver.onNext(update);

                Thread.sleep(1000); // Poll every 1s
            }
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }
}
