import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Users, RefreshCw } from "lucide-react";
import { queueServiceClient } from "@/services/grpcQueueService";
import { gqlFetch } from "@/lib/graphql";

interface QueueEntry {
  userId: string;
  position: number;
  joinedAt: string;
  status: "waiting" | "serving" | "completed" | "skipped";
}

interface GovernmentService {
  id: string;
  name: string;
  serviceCode: string;
}

interface ServiceLocation {
  id: string;
  name: string;
  address: string;
  city: string;
}

const SERVICES_QUERY = `
  query GetAllServices {
    getAllServices {
      id
      serviceCode
      name
    }
  }
`;

const LOCATIONS_QUERY = `
  query GetAllLocations {
    getAllLocations {
      id
      name
      address
      city
    }
  }
`;

export function AdminQueueManagement() {
  const [currentQueue, setCurrentQueue] = useState<QueueEntry[]>([]);
  const [services, setServices] = useState<GovernmentService[]>([]);
  const [locations, setLocations] = useState<ServiceLocation[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Load services and locations from GraphQL
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, locationsData] = await Promise.all([
          gqlFetch<{ getAllServices: GovernmentService[] }>(SERVICES_QUERY),
          gqlFetch<{ getAllLocations: ServiceLocation[] }>(LOCATIONS_QUERY),
        ]);
        
        setServices(servicesData.getAllServices || []);
        setLocations(locationsData.getAllLocations || []);
        
        // Set default selections
        if (servicesData.getAllServices?.length > 0 && !selectedService) {
          setSelectedService(servicesData.getAllServices[0].id);
        }
        if (locationsData.getAllLocations?.length > 0 && !selectedLocation) {
          setSelectedLocation(locationsData.getAllLocations[0].id);
        }
      } catch (error) {
        console.error("[Admin] Failed to load services/locations:", error);
        toast.error("Failed to load services and locations");
      }
    };
    
    loadData();
  }, []);

  const fetchQueueStatus = useCallback(async () => {
    try {
      console.log("[Admin] Fetching queue status for:", { selectedService, selectedLocation });
      
      const response = await queueServiceClient.getPosition({
        serviceId: selectedService,
        locationId: selectedLocation,
        userId: "ADMIN",
      });

      console.log("[Admin] Queue status response:", response);
      
      if (response.inQueue) {
        console.log("[Admin] Queue is active with", response.waiting, "people waiting");
      }
    } catch (error) {
      console.error("[Admin] Error fetching queue status:", error);
    }
  }, [selectedService, selectedLocation]);

  const startStreamingQueue = useCallback(async () => {
    if (isStreaming) return;
    
    setIsStreaming(true);
    try {
      console.log("[Admin] Starting queue stream:", { selectedService, selectedLocation });
      
      const stream = queueServiceClient.streamQueueStatus({
        serviceId: selectedService,
        locationId: selectedLocation,
        userId: "ADMIN",
      });

      for await (const update of stream) {
        console.log("[Admin] Queue update received:", update);
        
        setCurrentQueue((prev) => {
          let updated = [...prev];
          
          if (update.event === "joined") {
            updated.push({
              userId: update.userId,
              position: update.position,
              joinedAt: update.updatedAt,
              status: "waiting",
            });
          } else if (update.event === "served") {
            const idx = updated.findIndex((e) => e.userId === update.userId);
            if (idx >= 0) {
              updated[idx].status = "serving";
            }
          } else if (update.event === "left") {
            updated = updated.filter((e) => e.userId !== update.userId);
          } else if (update.event === "position_changed") {
            const idx = updated.findIndex((e) => e.userId === update.userId);
            if (idx >= 0) {
              updated[idx].position = update.position;
            }
          }
          
          return [...updated].sort((a, b) => a.position - b.position);
        });
      }
    } catch (error) {
      console.error("[Admin] Stream error:", error);
      toast.error("Lost connection to queue stream");
      setIsStreaming(false);
    }
  }, [selectedService, selectedLocation, isStreaming]);

  useEffect(() => {
    fetchQueueStatus();
    startStreamingQueue();
    
    return () => {
      setIsStreaming(false);
    };
  }, [selectedService, selectedLocation]);

  const handleCompleteService = async (userId: string) => {
    setIsLoading(true);
    try {
      console.log(`[Admin] Marking user ${userId} as completed`);
      
      const updatedQueue = currentQueue
        .map((entry) =>
          entry.userId === userId ? { ...entry, status: "completed" as const } : entry
        )
        .filter((e) => e.status !== "completed");

      const reorderedQueue = updatedQueue.map((entry, index) => ({
        ...entry,
        position: index + 1,
      }));

      setCurrentQueue(reorderedQueue);
      toast.success(`User ${userId} marked as served`);
    } catch (error) {
      console.error("[Admin] Error completing service:", error);
      toast.error("Failed to update queue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipUser = async (userId: string) => {
    setIsLoading(true);
    try {
      console.log(`[Admin] Skipping user ${userId}`);
      
      const updatedQueue = currentQueue
        .map((entry) =>
          entry.userId === userId ? { ...entry, status: "skipped" as const } : entry
        )
        .filter((e) => e.status !== "skipped");

      const reorderedQueue = updatedQueue.map((entry, index) => ({
        ...entry,
        position: index + 1,
      }));

      setCurrentQueue(reorderedQueue);
      toast.warning(`User ${userId} skipped`);
    } catch (error) {
      console.error("[Admin] Error skipping user:", error);
      toast.error("Failed to skip user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallNext = async () => {
    setIsLoading(true);
    try {
      console.log("[Admin] Calling next user");
      
      if (currentQueue.length === 0) {
        toast.warning("Queue is empty");
        return;
      }

      const updatedQueue = currentQueue.map((entry, index) =>
        index === 0 ? { ...entry, status: "serving" as const } : entry
      );

      setCurrentQueue(updatedQueue);

      const nextUser = currentQueue[0];
      if (nextUser) {
        toast.success(`Now serving: ${nextUser.userId}`);
      }
    } catch (error) {
      console.error("[Admin] Error calling next:", error);
      toast.error("Failed to call next user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchQueueStatus();
      toast.success("Queue refreshed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearQueue = async () => {
    if (!confirm("Are you sure you want to clear the entire queue?")) return;
    
    setIsLoading(true);
    try {
      console.log("[Admin] Clearing queue");
      setCurrentQueue([]);
      toast.success("Queue cleared");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "serving":
        return "bg-blue-100 text-blue-800";
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "skipped":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "serving":
        return <Clock className="w-4 h-4" />;
      case "waiting":
        return <Users className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "skipped":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Queue Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Service</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                disabled={services.length === 0}
              >
                {services.length === 0 ? (
                  <option value="">Loading services...</option>
                ) : (
                  services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                disabled={locations.length === 0}
              >
                {locations.length === 0 ? (
                  <option value="">Loading locations...</option>
                ) : (
                  locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.city}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {isStreaming ? (
              <span className="text-green-600">● Streaming live updates</span>
            ) : (
              <span className="text-yellow-600">● Not streaming</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Queue Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{currentQueue.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total in Queue</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {currentQueue.filter((e) => e.status === "serving").length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Currently Serving</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {currentQueue.filter((e) => e.status === "waiting").length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Waiting</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {currentQueue.filter((e) => e.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Completed</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Queue Control */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Queue Control</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleCallNext}
                disabled={isLoading || currentQueue.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Call Next
              </Button>
              <Button
                onClick={handleClearQueue}
                disabled={isLoading || currentQueue.length === 0}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Clear Queue
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQueue.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Queue is empty</p>
                <p className="text-xs mt-1">Waiting for customers to join the queue...</p>
              </div>
            ) : (
              currentQueue.map((entry) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-4 border rounded-lg transition ${
                    entry.status === "serving" ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-lg font-bold text-gray-600 w-8 text-center">
                      #{entry.position}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{entry.userId}</p>
                      <p className="text-sm text-gray-500">
                        Joined: {new Date(entry.joinedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge className={`flex items-center gap-2 ${getStatusColor(entry.status)}`}>
                      {getStatusIcon(entry.status)}
                      {entry.status}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  {(entry.status === "waiting" || entry.status === "serving") && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleCompleteService(entry.userId)}
                        disabled={isLoading}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {entry.status === "serving" ? "Finished" : "Complete"}
                      </Button>
                      <Button
                        onClick={() => handleSkipUser(entry.userId)}
                        disabled={isLoading}
                        size="sm"
                        variant="outline"
                      >
                        Skip
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Queue History */}
      <Card>
        <CardHeader>
          <CardTitle>Service Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {currentQueue
              .filter((e) => e.status === "completed" || e.status === "skipped")
              .map((entry) => (
                <div key={entry.userId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{entry.userId}</span>
                  <Badge variant="outline" className={getStatusColor(entry.status)}>
                    {entry.status}
                  </Badge>
                </div>
              ))}
            {currentQueue.filter((e) => e.status === "completed" || e.status === "skipped").length === 0 && (
              <p className="text-gray-500 text-center py-4">No completed/skipped services yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
