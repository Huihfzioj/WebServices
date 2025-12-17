import { useState, useEffect, useCallback } from "react";
import { AdminRequest, RequestLifecycle, RequestHistory, UpdateStatusDTO, CreateRequestDTO, RequestType } from "@/types/request";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { requestService } from "@/services/requestService";
import { civilRegistryService } from "@/services/civilRegistryService";
import { BirthCertificate, DeathCertificate, MarriageCertificate } from "@/types/certificate";

export const useRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let data: AdminRequest[];
      
      console.log('[useRequests] Loading requests for user:', user.role, user.id);
      
      // Admins get all requests, regular users get only their requests
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        console.log('[useRequests] Fetching all requests (admin)');
        data = await requestService.getAllRequests();
      } else {
        // Regular users: load by their citizen ID
        const citizenId = user.citizenId ?? Number(user.id);
        if (!citizenId || Number.isNaN(citizenId)) {
          console.warn('[useRequests] Missing or invalid citizenId; skipping fetch');
          setRequests([]);
          return;
        }
        console.log('[useRequests] Fetching requests for citizen:', citizenId);
        data = await requestService.getRequestsByCitizen(citizenId);
      }
      
      console.log('[useRequests] Loaded requests:', data.length);
      setRequests(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("[useRequests] Failed to load requests:", errorMessage);
      toast.error(`Failed to load requests: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const createRequest = async (request: Omit<AdminRequest, "id" | "createdAt" | "updatedAt" | "status" | "history">) => {
    if (!user) {
      toast.error("You must be logged in to submit a request");
      return null;
    }

    try {
      setLoading(true);
      const dto: CreateRequestDTO = {
        citizenId: request.citizenID,
        type: request.type,
        comment: request.comment,
        attachments: request.attachments || [],
      };

      const newRequest = await requestService.createRequest(dto);
      setRequests([...requests, newRequest]);
      toast.success("Request submitted successfully!");
      return newRequest;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Failed to create request:", errorMessage);
      toast.error(`Failed to submit request: ${errorMessage}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (
    requestId: number,
    newStatus: RequestLifecycle,
    updateData: UpdateStatusDTO
  ) => {
    if (!user) {
      toast.error("You must be logged in to update requests");
      return false;
    }

    try {
      setLoading(true);
      let updatedRequest: AdminRequest;

      switch (newStatus) {
        case RequestLifecycle.IN_REVIEW:
          updatedRequest = await requestService.startReview(requestId, updateData);
          break;
        case RequestLifecycle.APPROVED:
          updatedRequest = await requestService.approve(requestId, updateData);
          
          // Auto-create certificate in Civil Registry if it's a certificate request
          const request = requests.find(r => r.id === requestId);
          if (request && (
            request.type === RequestType.BIRTH_CERTIFICATE ||
            request.type === RequestType.DEATH_CERTIFICATE ||
            request.type === RequestType.MARRIAGE_CERTIFICATE
          )) {
            await createCertificateInRegistry(request);
          }
          break;
        case RequestLifecycle.REJECTED:
          updatedRequest = await requestService.reject(requestId, updateData);
          break;
        case RequestLifecycle.COMPLETED:
          updatedRequest = await requestService.complete(requestId, updateData);
          break;
        default:
          toast.error("Invalid status update");
          return false;
      }

      const updatedRequests = requests.map((r) =>
        r.id === requestId ? updatedRequest : r
      );
      setRequests(updatedRequests);
      toast.success("Request status updated successfully!");
      return true;
    } catch (error) {
      console.error("Failed to update request status:", error);
      toast.error("Failed to update request status");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createCertificateInRegistry = async (request: AdminRequest) => {
    try {
      // Retrieve certificate data from sessionStorage
      if (!request.id) {
        console.warn("[useRequests] Request has no ID");
        return;
      }

      let certificateData: any = null;
      
      try {
        const certificateDataMap = JSON.parse(sessionStorage.getItem('certificateDataMap') || '{}');
        certificateData = certificateDataMap[request.id];
        
        if (certificateData) {
          console.log("[useRequests] Retrieved certificate data from sessionStorage for request", request.id);
          // Clean up after retrieval
          delete certificateDataMap[request.id];
          sessionStorage.setItem('certificateDataMap', JSON.stringify(certificateDataMap));
        }
      } catch (error) {
        console.error("[useRequests] Failed to retrieve certificate data from sessionStorage:", error);
      }
      
      if (!certificateData) {
        console.warn("[useRequests] No certificate data found for request", request.id);
        return;
      }

      // Generate certificate number if not present
      if (!certificateData.certificateNumber) {
        certificateData.certificateNumber = `CERT-${request.id}-${Date.now()}`;
      }

      // Set registration date if not present
      if (!certificateData.registrationDate) {
        certificateData.registrationDate = new Date().toISOString().split('T')[0];
      }

      console.log("[useRequests] Creating certificate in Civil Registry:", request.type);

      let success = false;
      switch (request.type) {
        case RequestType.BIRTH_CERTIFICATE:
          success = await civilRegistryService.createBirthCertificate(certificateData as BirthCertificate);
          break;
        case RequestType.DEATH_CERTIFICATE:
          success = await civilRegistryService.createDeathCertificate(certificateData as DeathCertificate);
          break;
        case RequestType.MARRIAGE_CERTIFICATE:
          success = await civilRegistryService.createMarriageCertificate(certificateData as MarriageCertificate);
          break;
      }

      if (success) {
        toast.success("Certificate added to Civil Registry!");
      } else {
        toast.error("Failed to add certificate to Civil Registry");
      }
    } catch (error) {
      console.error("[useRequests] Failed to create certificate in registry:", error);
      toast.error("Failed to add certificate to Civil Registry");
    }
  };

  const getUserRequests = () => {
    if (!user) return [];
    const citizenId = user.citizenId ?? Number(user.id);
    if (!citizenId || Number.isNaN(citizenId)) return [];
    return requests.filter((r) => r.citizenID === citizenId);
  };

  const getAllRequests = async () => {
    try {
      setLoading(true);
      // For admin users, you might want to fetch all requests
      // This would require a different endpoint or role-based logic
      return requests;
    } catch (error) {
      console.error("Failed to load all requests:", error);
      toast.error("Failed to load requests");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getRequestById = async (id: number) => {
    try {
      return await requestService.getRequest(id);
    } catch (error) {
      console.error("Failed to load request:", error);
      toast.error("Failed to load request");
      return undefined;
    }
  };

  const getRequestHistory = async (id: number): Promise<RequestHistory[]> => {
    try {
      return await requestService.getHistory(id);
    } catch (error) {
      console.error("Failed to load request history:", error);
      toast.error("Failed to load request history");
      return [];
    }
  };

  const addAttachment = async (id: number, file: File): Promise<AdminRequest | null> => {
    try {
      setLoading(true);
      const updatedRequest = await requestService.addAttachment(id, file);
      const updatedRequests = requests.map((r) =>
        r.id === id ? updatedRequest : r
      );
      setRequests(updatedRequests);
      toast.success("Attachment added successfully!");
      return updatedRequest;
    } catch (error) {
      console.error("Failed to add attachment:", error);
      toast.error("Failed to add attachment");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    requests,
    loading,
    createRequest,
    updateRequestStatus,
    getUserRequests,
    getAllRequests,
    getRequestById,
    getRequestHistory,
    addAttachment,
    loadRequests,
  };
};
