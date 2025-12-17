import { useState, useEffect, useCallback } from "react";
import {
  Establishment,
  QueueTicket,
  GovernmentService,
  ServiceLocation,
} from "@/types/establishment";
import { RequestType } from "@/types/request";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { gqlFetch } from "@/lib/graphql";

const QUEUE_KEY = "govserve_queue";
const LOCATIONS_QUERY = `
  query GetAllLocations {
    getAllLocations {
      id
      name
      address
      city
      state
      zipCode
      phone
      mail
      website
      operatingHours
      availableServiceIds
      coordinates { latitude longitude }
    }
  }
`;

const SERVICES_QUERY = `
  query GetAllServices {
    getAllServices {
      id
      serviceCode
      name
      description
      detailedDescription
      type
      category
      availableOnline
      isActive
    }
  }
`;

export const useEstablishments = () => {
  console.log("[HOOK] useEstablishments called!");
  const { user } = useAuth();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [services, setServices] = useState<GovernmentService[]>([]);
  const [locations, setLocations] = useState<ServiceLocation[]>([]);
  const [queueTickets, setQueueTickets] = useState<QueueTicket[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("All Locations");
  const [loadingEstablishments, setLoadingEstablishments] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const loadServices = useCallback(async () => {
    setLoadingServices(true);
    try {
      console.log("[DEBUG] Starting to load services...");
      const data = await gqlFetch<{ getAllServices: GovernmentService[] }>(SERVICES_QUERY);
      console.log("[DEBUG] Services data received:", data);
      console.log("[DEBUG] Services getAllServices:", data.getAllServices);
      console.log("[DEBUG] Services count:", data.getAllServices?.length);
      setServices(data.getAllServices || []);
    } catch (error) {
      console.error("[ERROR] Failed to load services", error);
      toast.error("Unable to load services");
    } finally {
      setLoadingServices(false);
    }
  }, []);

  const loadEstablishments = useCallback(
    async (serviceList: GovernmentService[]) => {
      setLoadingEstablishments(true);
      try {
      const data = await gqlFetch<{ getAllLocations: ServiceLocation[] }>(LOCATIONS_QUERY);
      console.log("[DEBUG] Full Locations response:", JSON.stringify(data.getAllLocations, null, 2));
      console.log("[DEBUG] First location full object:", data.getAllLocations?.[0]);
      console.log("[DEBUG] All keys in first location:", Object.keys(data.getAllLocations?.[0] || {}));
      
      setLocations(data.getAllLocations || []);
      
      const serviceMap = new Map(serviceList.map((s) => [s.id, s]));
        const mapped: Establishment[] = (data.getAllLocations || []).map((loc: any) => {
          let servicesForLocation: GovernmentService[] = [];
          
          // Try multiple field names in case of mapping issues
          const serviceIds = loc.availableServiceIds || loc.availableServices || loc.available_services || [];
          console.log(`[DEBUG] Location ${loc.name} - serviceIds:`, serviceIds);
          
          if (serviceIds && serviceIds.length > 0) {
            servicesForLocation = serviceIds
              .map((svcId: string) => serviceMap.get(svcId))
              .filter(Boolean) as GovernmentService[];
            console.log(`[DEBUG] Location ${loc.name} - mapped services:`, servicesForLocation.length);
          } else {
            // Fallback: assign first 3 services to all locations
            console.log(`[DEBUG] Location ${loc.name} - using fallback services`);
            servicesForLocation = Array.from(serviceMap.values()).slice(0, 3);
          }

          return {
            id: loc.id,
            name: loc.name,
            location: loc.city || loc.state || "Unknown",
            address: loc.address || loc.city || "",
            services: servicesForLocation,
            currentQueueNumber: 0,
            isOpen: true,
          };
        });
        console.log("[DEBUG] Mapped establishments:", mapped);
        setEstablishments(mapped);
      } catch (error) {
        console.error("Failed to load locations", error);
        toast.error("Unable to load service locations");
      } finally {
        setLoadingEstablishments(false);
      }
    },
    []
  );

  useEffect(() => {
    console.log("[DEBUG] Hook mounted - loading services...");
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    console.log("[DEBUG] Services changed - count:", services.length);
    if (services.length > 0) {
      console.log("[DEBUG] Calling loadEstablishments with services");
      loadEstablishments(services);
    }
  }, [services, loadEstablishments]);

  useEffect(() => {
    const storedQueue = localStorage.getItem(QUEUE_KEY);
    if (storedQueue) {
      setQueueTickets(JSON.parse(storedQueue));
    }
  }, []);

  const saveQueue = (updated: QueueTicket[]) => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
    setQueueTickets(updated);
  };

  const getFilteredEstablishments = () => {
    if (selectedLocation === "All Locations") return establishments;
    return establishments.filter((e) => e.location === selectedLocation);
  };

  const joinQueue = (establishmentId: string, service: RequestType): QueueTicket | null => {
    if (!user) {
      toast.error("You must be logged in to join a queue");
      return null;
    }

    const establishment = establishments.find((e) => e.id === establishmentId);
    if (!establishment) {
      toast.error("Establishment not found");
      return null;
    }

    if (!establishment.isOpen) {
      toast.error("This establishment is currently closed");
      return null;
    }

    // Check if user already has an active ticket at this establishment
    const existingTicket = queueTickets.find(
      (t) =>
        t.visitorId === user.id &&
        t.establishmentId === establishmentId &&
        (t.status === "WAITING" || t.status === "SERVING")
    );

    if (existingTicket) {
      toast.error("You already have an active ticket at this establishment");
      return null;
    }

    const newQueueNumber = establishment.currentQueueNumber + 1;
    
    const ticket: QueueTicket = {
      id: `ticket-${Date.now()}`,
      ticketNumber: newQueueNumber,
      visitorId: user.id,
      visitorName: user.name,
      establishmentId,
      service,
      status: "WAITING",
      createdAt: new Date().toISOString(),
    };

    // Update establishment queue number locally
    setEstablishments((prev) =>
      prev.map((e) => (e.id === establishmentId ? { ...e, currentQueueNumber: newQueueNumber } : e))
    );

    // Add ticket to queue
    const updatedQueue = [...queueTickets, ticket];
    saveQueue(updatedQueue);

    toast.success(`Ticket #${newQueueNumber} generated for ${establishment.name}`);
    return ticket;
  };

  const getUserTickets = () => {
    if (!user) return [];
    return queueTickets.filter((t) => t.visitorId === user.id);
  };

  const getEstablishmentQueue = (establishmentId: string) => {
    return queueTickets.filter(
      (t) => t.establishmentId === establishmentId && t.status === "WAITING"
    );
  };

  const getLocationData = (establishmentId: string): ServiceLocation | null => {
    return locations.find((loc) => loc.id === establishmentId) || null;
  };

  const cancelTicket = (ticketId: string) => {
    const updatedQueue = queueTickets.map((t) =>
      t.id === ticketId ? { ...t, status: "CANCELLED" as const } : t
    );
    saveQueue(updatedQueue);
    toast.success("Ticket cancelled successfully");
  };

  return {
    establishments,
    services,
    locations: [
      "All Locations",
      ...Array.from(new Set(establishments.map((e) => e.location).filter(Boolean))),
    ],
    loadingEstablishments,
    loadingServices,
    queueTickets,
    selectedLocation,
    setSelectedLocation,
    getFilteredEstablishments,
    joinQueue,
    getUserTickets,
    getEstablishmentQueue,
    getLocationData,
    cancelTicket,
  };
};
