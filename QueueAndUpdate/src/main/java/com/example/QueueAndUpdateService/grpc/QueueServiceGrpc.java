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
public final class QueueServiceGrpc {

  private QueueServiceGrpc() {}

  public static final String SERVICE_NAME = "queue.QueueService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.JoinQueueRequest,
      com.example.QueueAndUpdateService.grpc.JoinQueueResponse> getJoinQueueMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "JoinQueue",
      requestType = com.example.QueueAndUpdateService.grpc.JoinQueueRequest.class,
      responseType = com.example.QueueAndUpdateService.grpc.JoinQueueResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.JoinQueueRequest,
      com.example.QueueAndUpdateService.grpc.JoinQueueResponse> getJoinQueueMethod() {
    io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.JoinQueueRequest, com.example.QueueAndUpdateService.grpc.JoinQueueResponse> getJoinQueueMethod;
    if ((getJoinQueueMethod = QueueServiceGrpc.getJoinQueueMethod) == null) {
      synchronized (QueueServiceGrpc.class) {
        if ((getJoinQueueMethod = QueueServiceGrpc.getJoinQueueMethod) == null) {
          QueueServiceGrpc.getJoinQueueMethod = getJoinQueueMethod = 
              io.grpc.MethodDescriptor.<com.example.QueueAndUpdateService.grpc.JoinQueueRequest, com.example.QueueAndUpdateService.grpc.JoinQueueResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "queue.QueueService", "JoinQueue"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.QueueAndUpdateService.grpc.JoinQueueRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.QueueAndUpdateService.grpc.JoinQueueResponse.getDefaultInstance()))
                  .setSchemaDescriptor(new QueueServiceMethodDescriptorSupplier("JoinQueue"))
                  .build();
          }
        }
     }
     return getJoinQueueMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.LeaveQueueRequest,
      com.example.QueueAndUpdateService.grpc.LeaveQueueResponse> getLeaveQueueMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "LeaveQueue",
      requestType = com.example.QueueAndUpdateService.grpc.LeaveQueueRequest.class,
      responseType = com.example.QueueAndUpdateService.grpc.LeaveQueueResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.LeaveQueueRequest,
      com.example.QueueAndUpdateService.grpc.LeaveQueueResponse> getLeaveQueueMethod() {
    io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.LeaveQueueRequest, com.example.QueueAndUpdateService.grpc.LeaveQueueResponse> getLeaveQueueMethod;
    if ((getLeaveQueueMethod = QueueServiceGrpc.getLeaveQueueMethod) == null) {
      synchronized (QueueServiceGrpc.class) {
        if ((getLeaveQueueMethod = QueueServiceGrpc.getLeaveQueueMethod) == null) {
          QueueServiceGrpc.getLeaveQueueMethod = getLeaveQueueMethod = 
              io.grpc.MethodDescriptor.<com.example.QueueAndUpdateService.grpc.LeaveQueueRequest, com.example.QueueAndUpdateService.grpc.LeaveQueueResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "queue.QueueService", "LeaveQueue"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.QueueAndUpdateService.grpc.LeaveQueueRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.QueueAndUpdateService.grpc.LeaveQueueResponse.getDefaultInstance()))
                  .setSchemaDescriptor(new QueueServiceMethodDescriptorSupplier("LeaveQueue"))
                  .build();
          }
        }
     }
     return getLeaveQueueMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.QueueStatusRequest,
      com.example.QueueAndUpdateService.grpc.QueueStatusResponse> getStreamQueueStatusMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "StreamQueueStatus",
      requestType = com.example.QueueAndUpdateService.grpc.QueueStatusRequest.class,
      responseType = com.example.QueueAndUpdateService.grpc.QueueStatusResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.SERVER_STREAMING)
  public static io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.QueueStatusRequest,
      com.example.QueueAndUpdateService.grpc.QueueStatusResponse> getStreamQueueStatusMethod() {
    io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.QueueStatusRequest, com.example.QueueAndUpdateService.grpc.QueueStatusResponse> getStreamQueueStatusMethod;
    if ((getStreamQueueStatusMethod = QueueServiceGrpc.getStreamQueueStatusMethod) == null) {
      synchronized (QueueServiceGrpc.class) {
        if ((getStreamQueueStatusMethod = QueueServiceGrpc.getStreamQueueStatusMethod) == null) {
          QueueServiceGrpc.getStreamQueueStatusMethod = getStreamQueueStatusMethod = 
              io.grpc.MethodDescriptor.<com.example.QueueAndUpdateService.grpc.QueueStatusRequest, com.example.QueueAndUpdateService.grpc.QueueStatusResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.SERVER_STREAMING)
              .setFullMethodName(generateFullMethodName(
                  "queue.QueueService", "StreamQueueStatus"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.QueueAndUpdateService.grpc.QueueStatusRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.QueueAndUpdateService.grpc.QueueStatusResponse.getDefaultInstance()))
                  .setSchemaDescriptor(new QueueServiceMethodDescriptorSupplier("StreamQueueStatus"))
                  .build();
          }
        }
     }
     return getStreamQueueStatusMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.GetPositionRequest,
      com.example.QueueAndUpdateService.grpc.GetPositionResponse> getGetPositionMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetPosition",
      requestType = com.example.QueueAndUpdateService.grpc.GetPositionRequest.class,
      responseType = com.example.QueueAndUpdateService.grpc.GetPositionResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.GetPositionRequest,
      com.example.QueueAndUpdateService.grpc.GetPositionResponse> getGetPositionMethod() {
    io.grpc.MethodDescriptor<com.example.QueueAndUpdateService.grpc.GetPositionRequest, com.example.QueueAndUpdateService.grpc.GetPositionResponse> getGetPositionMethod;
    if ((getGetPositionMethod = QueueServiceGrpc.getGetPositionMethod) == null) {
      synchronized (QueueServiceGrpc.class) {
        if ((getGetPositionMethod = QueueServiceGrpc.getGetPositionMethod) == null) {
          QueueServiceGrpc.getGetPositionMethod = getGetPositionMethod = 
              io.grpc.MethodDescriptor.<com.example.QueueAndUpdateService.grpc.GetPositionRequest, com.example.QueueAndUpdateService.grpc.GetPositionResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "queue.QueueService", "GetPosition"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.QueueAndUpdateService.grpc.GetPositionRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.example.QueueAndUpdateService.grpc.GetPositionResponse.getDefaultInstance()))
                  .setSchemaDescriptor(new QueueServiceMethodDescriptorSupplier("GetPosition"))
                  .build();
          }
        }
     }
     return getGetPositionMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static QueueServiceStub newStub(io.grpc.Channel channel) {
    return new QueueServiceStub(channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static QueueServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    return new QueueServiceBlockingStub(channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static QueueServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    return new QueueServiceFutureStub(channel);
  }

  /**
   */
  public static abstract class QueueServiceImplBase implements io.grpc.BindableService {

    /**
     * <pre>
     * Client calls to join the service queue
     * </pre>
     */
    public void joinQueue(com.example.QueueAndUpdateService.grpc.JoinQueueRequest request,
        io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.JoinQueueResponse> responseObserver) {
      asyncUnimplementedUnaryCall(getJoinQueueMethod(), responseObserver);
    }

    /**
     * <pre>
     * Client calls to leave the queue (cancel)
     * </pre>
     */
    public void leaveQueue(com.example.QueueAndUpdateService.grpc.LeaveQueueRequest request,
        io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.LeaveQueueResponse> responseObserver) {
      asyncUnimplementedUnaryCall(getLeaveQueueMethod(), responseObserver);
    }

    /**
     * <pre>
     * Server-streaming: client receives continuous updates for their queue
     * </pre>
     */
    public void streamQueueStatus(com.example.QueueAndUpdateService.grpc.QueueStatusRequest request,
        io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.QueueStatusResponse> responseObserver) {
      asyncUnimplementedUnaryCall(getStreamQueueStatusMethod(), responseObserver);
    }

    /**
     * <pre>
     * Get user position and simple stats (unary)
     * </pre>
     */
    public void getPosition(com.example.QueueAndUpdateService.grpc.GetPositionRequest request,
        io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.GetPositionResponse> responseObserver) {
      asyncUnimplementedUnaryCall(getGetPositionMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getJoinQueueMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.example.QueueAndUpdateService.grpc.JoinQueueRequest,
                com.example.QueueAndUpdateService.grpc.JoinQueueResponse>(
                  this, METHODID_JOIN_QUEUE)))
          .addMethod(
            getLeaveQueueMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.example.QueueAndUpdateService.grpc.LeaveQueueRequest,
                com.example.QueueAndUpdateService.grpc.LeaveQueueResponse>(
                  this, METHODID_LEAVE_QUEUE)))
          .addMethod(
            getStreamQueueStatusMethod(),
            asyncServerStreamingCall(
              new MethodHandlers<
                com.example.QueueAndUpdateService.grpc.QueueStatusRequest,
                com.example.QueueAndUpdateService.grpc.QueueStatusResponse>(
                  this, METHODID_STREAM_QUEUE_STATUS)))
          .addMethod(
            getGetPositionMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.example.QueueAndUpdateService.grpc.GetPositionRequest,
                com.example.QueueAndUpdateService.grpc.GetPositionResponse>(
                  this, METHODID_GET_POSITION)))
          .build();
    }
  }

  /**
   */
  public static final class QueueServiceStub extends io.grpc.stub.AbstractStub<QueueServiceStub> {
    private QueueServiceStub(io.grpc.Channel channel) {
      super(channel);
    }

    private QueueServiceStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected QueueServiceStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new QueueServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * Client calls to join the service queue
     * </pre>
     */
    public void joinQueue(com.example.QueueAndUpdateService.grpc.JoinQueueRequest request,
        io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.JoinQueueResponse> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getJoinQueueMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Client calls to leave the queue (cancel)
     * </pre>
     */
    public void leaveQueue(com.example.QueueAndUpdateService.grpc.LeaveQueueRequest request,
        io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.LeaveQueueResponse> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getLeaveQueueMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Server-streaming: client receives continuous updates for their queue
     * </pre>
     */
    public void streamQueueStatus(com.example.QueueAndUpdateService.grpc.QueueStatusRequest request,
        io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.QueueStatusResponse> responseObserver) {
      asyncServerStreamingCall(
          getChannel().newCall(getStreamQueueStatusMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Get user position and simple stats (unary)
     * </pre>
     */
    public void getPosition(com.example.QueueAndUpdateService.grpc.GetPositionRequest request,
        io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.GetPositionResponse> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getGetPositionMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   */
  public static final class QueueServiceBlockingStub extends io.grpc.stub.AbstractStub<QueueServiceBlockingStub> {
    private QueueServiceBlockingStub(io.grpc.Channel channel) {
      super(channel);
    }

    private QueueServiceBlockingStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected QueueServiceBlockingStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new QueueServiceBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * Client calls to join the service queue
     * </pre>
     */
    public com.example.QueueAndUpdateService.grpc.JoinQueueResponse joinQueue(com.example.QueueAndUpdateService.grpc.JoinQueueRequest request) {
      return blockingUnaryCall(
          getChannel(), getJoinQueueMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Client calls to leave the queue (cancel)
     * </pre>
     */
    public com.example.QueueAndUpdateService.grpc.LeaveQueueResponse leaveQueue(com.example.QueueAndUpdateService.grpc.LeaveQueueRequest request) {
      return blockingUnaryCall(
          getChannel(), getLeaveQueueMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Server-streaming: client receives continuous updates for their queue
     * </pre>
     */
    public java.util.Iterator<com.example.QueueAndUpdateService.grpc.QueueStatusResponse> streamQueueStatus(
        com.example.QueueAndUpdateService.grpc.QueueStatusRequest request) {
      return blockingServerStreamingCall(
          getChannel(), getStreamQueueStatusMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Get user position and simple stats (unary)
     * </pre>
     */
    public com.example.QueueAndUpdateService.grpc.GetPositionResponse getPosition(com.example.QueueAndUpdateService.grpc.GetPositionRequest request) {
      return blockingUnaryCall(
          getChannel(), getGetPositionMethod(), getCallOptions(), request);
    }
  }

  /**
   */
  public static final class QueueServiceFutureStub extends io.grpc.stub.AbstractStub<QueueServiceFutureStub> {
    private QueueServiceFutureStub(io.grpc.Channel channel) {
      super(channel);
    }

    private QueueServiceFutureStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected QueueServiceFutureStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new QueueServiceFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * Client calls to join the service queue
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.example.QueueAndUpdateService.grpc.JoinQueueResponse> joinQueue(
        com.example.QueueAndUpdateService.grpc.JoinQueueRequest request) {
      return futureUnaryCall(
          getChannel().newCall(getJoinQueueMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Client calls to leave the queue (cancel)
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.example.QueueAndUpdateService.grpc.LeaveQueueResponse> leaveQueue(
        com.example.QueueAndUpdateService.grpc.LeaveQueueRequest request) {
      return futureUnaryCall(
          getChannel().newCall(getLeaveQueueMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Get user position and simple stats (unary)
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.example.QueueAndUpdateService.grpc.GetPositionResponse> getPosition(
        com.example.QueueAndUpdateService.grpc.GetPositionRequest request) {
      return futureUnaryCall(
          getChannel().newCall(getGetPositionMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_JOIN_QUEUE = 0;
  private static final int METHODID_LEAVE_QUEUE = 1;
  private static final int METHODID_STREAM_QUEUE_STATUS = 2;
  private static final int METHODID_GET_POSITION = 3;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final QueueServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(QueueServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_JOIN_QUEUE:
          serviceImpl.joinQueue((com.example.QueueAndUpdateService.grpc.JoinQueueRequest) request,
              (io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.JoinQueueResponse>) responseObserver);
          break;
        case METHODID_LEAVE_QUEUE:
          serviceImpl.leaveQueue((com.example.QueueAndUpdateService.grpc.LeaveQueueRequest) request,
              (io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.LeaveQueueResponse>) responseObserver);
          break;
        case METHODID_STREAM_QUEUE_STATUS:
          serviceImpl.streamQueueStatus((com.example.QueueAndUpdateService.grpc.QueueStatusRequest) request,
              (io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.QueueStatusResponse>) responseObserver);
          break;
        case METHODID_GET_POSITION:
          serviceImpl.getPosition((com.example.QueueAndUpdateService.grpc.GetPositionRequest) request,
              (io.grpc.stub.StreamObserver<com.example.QueueAndUpdateService.grpc.GetPositionResponse>) responseObserver);
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

  private static abstract class QueueServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    QueueServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.example.QueueAndUpdateService.grpc.QueueProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("QueueService");
    }
  }

  private static final class QueueServiceFileDescriptorSupplier
      extends QueueServiceBaseDescriptorSupplier {
    QueueServiceFileDescriptorSupplier() {}
  }

  private static final class QueueServiceMethodDescriptorSupplier
      extends QueueServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    QueueServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (QueueServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new QueueServiceFileDescriptorSupplier())
              .addMethod(getJoinQueueMethod())
              .addMethod(getLeaveQueueMethod())
              .addMethod(getStreamQueueStatusMethod())
              .addMethod(getGetPositionMethod())
              .build();
        }
      }
    }
    return result;
  }
}
