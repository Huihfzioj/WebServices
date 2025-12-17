/**
 * gRPC Queue Service Client
 * Connects directly to gRPC server (bypasses gateway)
 * Uses gRPC protocol over HTTP/2 via fetch API
 */

const GRPC_SERVER_URL = "http://localhost:9090";

// Helper to encode protobuf messages (simplified for frontend)
const encodeMessage = (obj: any): Uint8Array => {
  // For simplicity, convert to JSON string and encode
  // In production, use proper protobuf library
  const json = JSON.stringify(obj);
  return new TextEncoder().encode(json);
};

// Helper to decode protobuf messages
const decodeMessage = (data: Uint8Array): any => {
  const text = new TextDecoder().decode(data);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

// Generic gRPC call handler
const makeGrpcCall = async <T>(
  serviceName: string,
  methodName: string,
  request: any
): Promise<T> => {
  const path = `/queue.${serviceName}/${methodName}`;
  const url = `${GRPC_SERVER_URL}${path}`;

  console.log(`[gRPC] Calling ${serviceName}.${methodName} at ${url}`, request);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/grpc+proto",
        "TE": "trailers",
      },
      body: encodeMessage(request),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[gRPC] ${methodName} error:`, error);
      throw new Error(`gRPC call failed: ${response.status} ${error}`);
    }

    const data = await response.arrayBuffer();
    const result = decodeMessage(new Uint8Array(data)) as T;
    console.log(`[gRPC] ${methodName} response:`, result);
    return result;
  } catch (error) {
    console.error(`[gRPC] ${methodName} failed:`, error);
    throw error;
  }
};

// Stream handler for server-streaming RPCs
const makeGrpcStream = async function* <T>(
  serviceName: string,
  methodName: string,
  request: any
): AsyncGenerator<T> {
  const path = `/queue.${serviceName}/${methodName}`;
  const url = `${GRPC_SERVER_URL}${path}`;

  console.log(`[gRPC] Streaming ${serviceName}.${methodName} at ${url}`, request);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/grpc+proto",
        "TE": "trailers",
      },
      body: encodeMessage(request),
    });

    if (!response.ok) {
      throw new Error(`Stream failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      // Parse individual messages from stream
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const message = JSON.parse(line);
            console.log(`[gRPC] Stream message:`, message);
            yield message as T;
          } catch {
            // Ignore parse errors for protocol frames
          }
        }
      }
    }
  } catch (error) {
    console.error(`[gRPC] Stream error:`, error);
    throw error;
  }
}

// Type definitions
export interface JoinQueueRequest {
  serviceId: string;
  locationId: string;
  userId: string;
}

export interface JoinQueueResponse {
  success: boolean;
  position: number;
  waiting: number;
  message: string;
}

export interface LeaveQueueRequest {
  serviceId: string;
  locationId: string;
  userId: string;
}

export interface LeaveQueueResponse {
  success: boolean;
  waiting: number;
  message: string;
}

export interface GetPositionRequest {
  serviceId: string;
  locationId: string;
  userId: string;
}

export interface GetPositionResponse {
  inQueue: boolean;
  position: number;
  waiting: number;
  message: string;
}

export interface QueueStatusRequest {
  serviceId: string;
  locationId: string;
  userId: string;
}

export interface QueueStatusResponse {
  userId: string;
  position: number;
  waiting: number;
  event: string;
  detail: string;
  updatedAt: string;
}

export interface RequestStatusRequest {
  requestId: number;
}

export interface RequestStatusUpdate {
  id: number;
  type: string;
  status: string;
}

// QueueService client
export const queueServiceClient = {
  /**
   * Join a queue for a specific service at a location
   */
  async joinQueue(request: JoinQueueRequest): Promise<JoinQueueResponse> {
    return makeGrpcCall<JoinQueueResponse>("QueueService", "JoinQueue", request);
  },

  /**
   * Leave a queue (cancel request)
   */
  async leaveQueue(request: LeaveQueueRequest): Promise<LeaveQueueResponse> {
    return makeGrpcCall<LeaveQueueResponse>("QueueService", "LeaveQueue", request);
  },

  /**
   * Get current position in queue (unary call)
   */
  async getPosition(request: GetPositionRequest): Promise<GetPositionResponse> {
    return makeGrpcCall<GetPositionResponse>("QueueService", "GetPosition", request);
  },

  /**
   * Stream queue status updates
   */
  streamQueueStatus(
    request: QueueStatusRequest
  ): AsyncIterable<QueueStatusResponse> {
    return {
      [Symbol.asyncIterator]: () => makeGrpcStream<QueueStatusResponse>("QueueService", "StreamQueueStatus", request),
    };
  },
};

// AdminRequestWatcherService client
export const adminRequestWatcherClient = {
  /**
   * Stream request status updates
   */
  streamRequestStatus(
    request: RequestStatusRequest
  ): AsyncIterable<RequestStatusUpdate> {
    return {
      [Symbol.asyncIterator]: () => makeGrpcStream<RequestStatusUpdate>("AdminRequestWatcherService", "StreamRequestStatus", request),
    };
  },
};
