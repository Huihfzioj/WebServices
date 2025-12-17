package com.example.QueueAndUpdateService.grpc;

import static io.grpc.MethodDescriptor.generateFullMethodName;
import static io.grpc.stub.ClientCalls.asyncBidiStreamingCall;
import static io.grpc.stub.ClientCalls.asyncClientStreamingCall;
import static io.grpc.stub.ClientCalls.asyncServerStreamingCall;
import static io.grpc.stub.ClientCalls.asyncUnaryCall;
import static io.grpc.stub.ClientCalls.blockingServerStreamingCall;
import static io.grpc.stub.ClientCalls.blockingUnaryCall;
import static io.grpc.stub.ClientCalls.futureUnaryCall;
import static io.grpc.stub.ServerCalls.asyncBidiStreamingCall;
import static io.grpc.stub.ServerCalls.asyncClientStreamingCall;
import static io.grpc.stub.ServerCalls.asyncServerStreamingCall;
import static io.grpc.stub.ServerCalls.asyncUnaryCall;
import static io.grpc.stub.ServerCalls.asyncUnimplementedStreamingCall;
import static io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.15.0)",
    comments = "Source: queue.proto")
public final class AdminRequestWatcherServiceGrpc {

  private AdminRequestWatcherServiceGrpc() {}

  public static final String SERVICE_NAME = "queue.AdminRequestWatcherService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.RequestStatusRequest,
      com.example.QueueAndUpdateService.grpc.RequestStatusUpdate> getStreamRequestStatusMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "StreamRequestStatus",
      requestType = com.example.QueueAndUpdateService.grpc.RequestStatusRequest.class,
      responseType = com.example.QueueAndUpdateService.grpc.RequestStatusUpdate.class,
      methodType = io.grpc.MethodDescriptor.MethodType.SERVER_STREAMING)
  public static io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.RequestStatusRequest,
      com.example.QueueAndUpdateService.grpc.RequestStatusUpdate> getStreamRequestStatusMethod() {
    io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.RequestStatusRequest, com.example.QueueAndUpdateService.grpc.RequestStatusUpdate> getStreamRequestStatusMethod;
    if ((getStreamRequestStatusMethod = AdminRequestWatcherServiceGrpc.getStreamRequestStatusMethod) == null) {
      synchronized (AdminRequestWatcherServiceGrpc.class) {
        if ((getStreamRequestStatusMethod = AdminRequestWatcherServiceGrpc.getStreamRequestStatusMethod) == null) {
          AdminRequestWatcherServiceGrpc.getStreamRequestStatusMethod = getStreamRequestStatusMethod = 
              io.grpc.MethodDescriptor.<com.example.QueueAndUpdateService.grpc.RequestStatusRequest, com.example.QueueAndUpdateService.grpc.RequestStatusUpdate>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.SERVER_STREAMING)
              .setFullMethodName(generateFullMethodName(
                  "queue.AdminRequestWatcherService", "StreamRequestStatus"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.QueueAndUpdateService.grpc.RequestStatusRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.QueueAndUpdateService.grpc.RequestStatusUpdate.getDefaultInstance()))
                  .setSchemaDescriptor(new AdminRequestWatcherServiceMethodDescriptorSupplier("StreamRequestStatus"))
                  .build();
          }
        }
     }
     return getStreamRequestStatusMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static AdminRequestWatcherServiceStub newStub(io.grpc.Channel channel) {
    return new AdminRequestWatcherServiceStub(channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static AdminRequestWatcherServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    return new AdminRequestWatcherServiceBlockingStub(channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static AdminRequestWatcherServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    return new AdminRequestWatcherServiceFutureStub(channel);
  }

  /**
   */
  public static abstract class AdminRequestWatcherServiceImplBase implements io.grpc.BindableService {

    /**
     */
    public void streamRequestStatus(com.example.QueueAndUpdateService.grpc.RequestStatusRequest request,
        io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.RequestStatusUpdate> responseObserver) {
      asyncUnimplementedUnaryCall(getStreamRequestStatusMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getStreamRequestStatusMethod(),
            asyncServerStreamingCall(
              new MethodHandlers<
                com.example.QueueAndUpdateService.grpc.RequestStatusRequest,
                com.example.QueueAndUpdateService.grpc.RequestStatusUpdate>(
                  this, METHODID_STREAM_REQUEST_STATUS)))
          .build();
    }
  }

  /**
   */
  public static final class AdminRequestWatcherServiceStub extends io.grpc.stub.AbstractStub<AdminRequestWatcherServiceStub> {
    private AdminRequestWatcherServiceStub(io.grpc.Channel channel) {
      super(channel);
    }

    private AdminRequestWatcherServiceStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected AdminRequestWatcherServiceStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new AdminRequestWatcherServiceStub(channel, callOptions);
    }

    /**
     */
    public void streamRequestStatus(com.example.QueueAndUpdateService.grpc.RequestStatusRequest request,
        io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.RequestStatusUpdate> responseObserver) {
      asyncServerStreamingCall(
          getChannel().newCall(getStreamRequestStatusMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   */
  public static final class AdminRequestWatcherServiceBlockingStub extends io.grpc.stub.AbstractStub<AdminRequestWatcherServiceBlockingStub> {
    private AdminRequestWatcherServiceBlockingStub(io.grpc.Channel channel) {
      super(channel);
    }

    private AdminRequestWatcherServiceBlockingStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected AdminRequestWatcherServiceBlockingStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new AdminRequestWatcherServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public java.util.Iterator<com.example.QueueAndUpdateService.grpc.RequestStatusUpdate> streamRequestStatus(
        com.example.QueueAndUpdateService.grpc.RequestStatusRequest request) {
      return blockingServerStreamingCall(
          getChannel(), getStreamRequestStatusMethod(), getCallOptions(), request);
    }
  }

  /**
   */
  public static final class AdminRequestWatcherServiceFutureStub extends io.grpc.stub.AbstractStub<AdminRequestWatcherServiceFutureStub> {
    private AdminRequestWatcherServiceFutureStub(io.grpc.Channel channel) {
      super(channel);
    }

    private AdminRequestWatcherServiceFutureStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected AdminRequestWatcherServiceFutureStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new AdminRequestWatcherServiceFutureStub(channel, callOptions);
    }
  }

  private static final int METHODID_STREAM_REQUEST_STATUS = 0;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final AdminRequestWatcherServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(AdminRequestWatcherServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_STREAM_REQUEST_STATUS:
          serviceImpl.streamRequestStatus((com.example.QueueAndUpdateService.grpc.RequestStatusRequest) request,
              (io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.RequestStatusUpdate>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  private static abstract class AdminRequestWatcherServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    AdminRequestWatcherServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.example.QueueAndUpdateService.grpc.QueueProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("AdminRequestWatcherService");
    }
  }

  private static final class AdminRequestWatcherServiceFileDescriptorSupplier
      extends AdminRequestWatcherServiceBaseDescriptorSupplier {
    AdminRequestWatcherServiceFileDescriptorSupplier() {}
  }

  private static final class AdminRequestWatcherServiceMethodDescriptorSupplier
      extends AdminRequestWatcherServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    AdminRequestWatcherServiceMethodDescriptorSupplier(String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (AdminRequestWatcherServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new AdminRequestWatcherServiceFileDescriptorSupplier())
              .addMethod(getStreamRequestStatusMethod())
              .build();
        }
      }
    }
    return result;
  }
}
