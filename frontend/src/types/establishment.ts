import { RequestType } from "./request";

// GraphQL service models
export interface GovernmentService {
  id: string;
  serviceCode?: string;
  name: string;
  description?: string;
  detailedDescription?: string;
  type: RequestType;
  category?: string;
  requiredDocuments?: string[];
  processingTimeDays?: number;
  fees?: number;
  eligibilityCriteria?: string[];
  availableOnline?: boolean;
  onlinePortalUrl?: string;
  isActive?: boolean;
}

export interface ServiceLocation {
  id: string;
  locationCode?: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  mail?: string;
  website?: string;
  operatingHours?: string[];
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  availableServiceIds?: string[];
}

export interface Establishment {
  id: string;
  name: string;
  location: string;
  address: string;
  services: GovernmentService[];
  currentQueueNumber: number;
  isOpen: boolean;
}

export interface QueueTicket {
  id: string;
  ticketNumber: number;
  visitorId: string;
  visitorName: string;
  establishmentId: string;
  service: RequestType;
  status: "WAITING" | "SERVING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export const LOCATIONS = [
  "All Locations",
  "Downtown",
  "North District",
  "South District",
  "East District",
  "West District",
  "Central Hub",
];
