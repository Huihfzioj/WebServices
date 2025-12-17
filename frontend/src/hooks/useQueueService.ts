import { useState, useCallback, useEffect } from "react";
import { queueServiceClient, adminRequestWatcherClient } from "@/services/grpcQueueService";
import { toast } from "sonner";

interface QueuePosition {
  serviceId: string;
  locationId: string;
  position: number;
  waiting: number;
  inQueue: boolean;
}

interface QueueUpdate {
  userId: string;
  position: number;
  waiting: number;
  event: string;
  detail: string;
  updatedAt: string;
}

interface RequestStatusUpdate {
  id: number;
  type: string;
  status: string;
}

export const useQueueService = () => {
  const [queuePosition, setQueuePosition] = useState<QueuePosition | null>(null);
  const [queueUpdates, setQueueUpdates] = useState<QueueUpdate[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);
  const [requestStatusUpdates, setRequestStatusUpdates] = useState<RequestStatusUpdate[]>([]);

  /**
   * Join a queue for a specific service
   */
  const joinQueue = useCallback(
    async (serviceId: string, locationId: string, userId: string) => {
      setIsLoadingQueue(true);
      try {
        console.log("[Hook] Joining queue:", { serviceId, locationId, userId });
        const response = await queueServiceClient.joinQueue({
          serviceId,
          locationId,
          userId,
        });

        if (response.success) {
          setQueuePosition({
            serviceId,
            locationId,
            position: response.position,
            waiting: response.waiting,
            inQueue: true,
          });
          toast.success(`Joined queue! Your position: ${response.position}`);
          console.log("[Hook] Successfully joined queue:", response);
        } else {
          toast.error(response.message || "Failed to join queue");
          console.error("[Hook] Failed to join queue:", response.message);
        }
        return response;
      } catch (error) {
        console.error("[Hook] Error joining queue:", error);
        toast.error("Unable to join queue");
        throw error;
      } finally {
        setIsLoadingQueue(false);
      }
    },
    []
  );

  /**
   * Leave a queue (cancel)
   */
  const leaveQueue = useCallback(
    async (serviceId: string, locationId: string, userId: string) => {
      setIsLoadingQueue(true);
      try {
        console.log("[Hook] Leaving queue:", { serviceId, locationId, userId });
        const response = await queueServiceClient.leaveQueue({
          serviceId,
          locationId,
          userId,
        });

        if (response.success) {
          setQueuePosition(null);
          toast.success("Left queue");
          console.log("[Hook] Successfully left queue:", response);
        } else {
          toast.error(response.message || "Failed to leave queue");
        }
        return response;
      } catch (error) {
        console.error("[Hook] Error leaving queue:", error);
        toast.error("Unable to leave queue");
        throw error;
      } finally {
        setIsLoadingQueue(false);
      }
    },
    []
  );

  /**
   * Get current position in queue
   */
  const getPosition = useCallback(
    async (serviceId: string, locationId: string, userId: string) => {
      try {
        console.log("[Hook] Getting position:", { serviceId, locationId, userId });
        const response = await queueServiceClient.getPosition({
          serviceId,
          locationId,
          userId,
        });

        if (response.inQueue) {
          setQueuePosition({
            serviceId,
            locationId,
            position: response.position,
            waiting: response.waiting,
            inQueue: true,
          });
          console.log("[Hook] Current position:", response);
        } else {
          setQueuePosition(null);
        }
        return response;
      } catch (error) {
        console.error("[Hook] Error getting position:", error);
        throw error;
      }
    },
    []
  );

  /**
   * Start streaming queue status updates
   */
  const startQueueStatusStream = useCallback(
    async (serviceId: string, locationId: string, userId: string) => {
      try {
        console.log("[Hook] Starting queue status stream:", { serviceId, locationId, userId });
        const stream = queueServiceClient.streamQueueStatus({
          serviceId,
          locationId,
          userId,
        });

        for await (const update of stream) {
          console.log("[Hook] Queue status update:", update);
          setQueueUpdates((prev) => [update, ...prev.slice(0, 9)]);

          // Update position if this is for the current user
          if (update.userId === userId) {
            setQueuePosition((prev) =>
              prev
                ? {
                    ...prev,
                    position: update.position,
                    waiting: update.waiting,
                  }
                : null
            );
          }
        }
      } catch (error) {
        console.error("[Hook] Queue status stream error:", error);
        toast.error("Lost connection to queue updates");
      }
    },
    []
  );

  /**
   * Start streaming request status updates
   */
  const startRequestStatusStream = useCallback(async (requestId: number) => {
    try {
      console.log("[Hook] Starting request status stream for:", requestId);
      const stream = adminRequestWatcherClient.streamRequestStatus({
        requestId,
      });

      for await (const update of stream) {
        console.log("[Hook] Request status update:", update);
        setRequestStatusUpdates((prev) => [update, ...prev.slice(0, 9)]);

        // Show toast for status changes
        if (update.status === "APPROVED") {
          toast.success(`Request ${update.id} has been approved!`);
        } else if (update.status === "REJECTED") {
          toast.error(`Request ${update.id} has been rejected`);
        }
      }
    } catch (error) {
      console.error("[Hook] Request status stream error:", error);
      toast.error("Lost connection to request updates");
    }
  }, []);

  return {
    // State
    queuePosition,
    queueUpdates,
    isLoadingQueue,
    requestStatusUpdates,

    // Queue operations
    joinQueue,
    leaveQueue,
    getPosition,

    // Streaming
    startQueueStatusStream,
    startRequestStatusStream,
  };
};
