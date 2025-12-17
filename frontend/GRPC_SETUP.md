# gRPC Queue Service Integration

## Overview
The frontend now includes gRPC integration for direct communication with the gRPC Queue Service (bypassing the HTTP gateway).

## Files Created

### 1. **Proto Definition** (`src/proto/queue.proto`)
- Contains service and message definitions for:
  - `QueueService` - queue operations (join, leave, stream status)
  - `AdminRequestWatcherService` - request status streaming

### 2. **gRPC Service Client** (`src/services/grpcQueueService.ts`)
Browser-compatible gRPC client that:
- Connects directly to gRPC server at `http://localhost:50051`
- Provides unary RPC calls: `joinQueue()`, `leaveQueue()`, `getPosition()`
- Provides server-streaming: `streamQueueStatus()`, `streamRequestStatus()`
- Uses fetch API for HTTP/2 communication

**Types exported:**
- `JoinQueueRequest/Response`
- `LeaveQueueRequest/Response`
- `GetPositionRequest/Response`
- `QueueStatusRequest/Response`
- `RequestStatusRequest/Update`

**Clients exported:**
- `queueServiceClient` - for queue operations
- `adminRequestWatcherClient` - for request status updates

### 3. **React Hook** (`src/hooks/useQueueService.ts`)
Custom hook providing easy integration with gRPC services:

```typescript
const {
  // State
  queuePosition,
  queueUpdates,
  isLoadingQueue,
  requestStatusUpdates,

  // Methods
  joinQueue,
  leaveQueue,
  getPosition,
  startQueueStatusStream,
  startRequestStatusStream,
} = useQueueService();
```

## Usage Examples

### Join a Queue
```typescript
import { useQueueService } from "@/hooks/useQueueService";

function MyComponent() {
  const { joinQueue, queuePosition } = useQueueService();

  const handleJoin = async () => {
    await joinQueue("SERVICE_001", "LOCATION_001", "USER_123");
  };

  return (
    <div>
      <button onClick={handleJoin}>Join Queue</button>
      {queuePosition && (
        <p>Your position: {queuePosition.position}/{queuePosition.waiting}</p>
      )}
    </div>
  );
}
```

### Stream Queue Updates
```typescript
function QueueUpdates() {
  const { startQueueStatusStream } = useQueueService();

  useEffect(() => {
    startQueueStatusStream("SERVICE_001", "LOCATION_001", "USER_123");
  }, []);

  return <div>Streaming queue updates...</div>;
}
```

### Watch Request Status
```typescript
function RequestWatcher() {
  const { startRequestStatusStream } = useQueueService();

  useEffect(() => {
    startRequestStatusStream(123); // requestId
  }, []);

  return <div>Watching request status...</div>;
}
```

## Configuration

### gRPC Server Port
The gRPC server URL is hardcoded in `grpcQueueService.ts`:
```typescript
const GRPC_SERVER_URL = "http://localhost:50051";
```

Change this if your gRPC service runs on a different port.

### Message Encoding
Currently uses JSON for protobuf encoding (simplified for browser use).
For production, consider using a proper protobuf library like `protobufjs`.

## Important Notes

1. **Direct Connection**: Requests bypass the HTTP gateway and connect directly to the gRPC service at port 50051
2. **Async Streaming**: Stream responses use async generators for clean integration with React
3. **Browser Compatibility**: Uses fetch API and gRPC over HTTP/2
4. **Error Handling**: All methods include console logging and toast notifications for errors

## Vite Configuration
No special Vite configuration needed - gRPC communicates via HTTP/2 fetch.

## Testing
Once the backend gRPC service is running on port 50051, test with:
```typescript
import { queueServiceClient } from "@/services/grpcQueueService";

const response = await queueServiceClient.joinQueue({
  serviceId: "SERVICE_001",
  locationId: "LOCATION_001",
  userId: "USER_123",
});
```
