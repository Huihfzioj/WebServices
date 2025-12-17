import { API_ENDPOINTS, apiFetch, apiUpload } from "@/lib/api";
import {
  AdminRequest,
  CreateRequestDTO,
  UpdateStatusDTO,
  RequestHistory,
  RequestLifecycle,
  RequestType,
  AdminRequestStatusDTO,
} from "@/types/request";

export const requestService = {
  // Create a new request
  async createRequest(dto: CreateRequestDTO): Promise<AdminRequest> {
    console.log('[requestService] Creating request with DTO:', dto);
    const response = await apiFetch<AdminRequest>(API_ENDPOINTS.createRequest(), {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    console.log('[requestService] Request created:', response);
    return response;
  },

  // Get request by ID
  async getRequest(id: number): Promise<AdminRequest> {
    return apiFetch<AdminRequest>(API_ENDPOINTS.getRequest(id), {
      method: 'GET',
    });
  },

  // Get requests by citizen ID
  async getRequestsByCitizen(citizenId: number): Promise<AdminRequest[]> {
    return apiFetch<AdminRequest[]>(API_ENDPOINTS.getRequestsByCitizen(citizenId), {
      method: 'GET',
    });
  },

  // Get requests by status
  async getRequestsByStatus(status: RequestLifecycle): Promise<AdminRequest[]> {
    return apiFetch<AdminRequest[]>(API_ENDPOINTS.getRequestsByStatus(status), {
      method: 'GET',
    });
  },

  // Get all requests (admin only) - fetches by all statuses
  async getAllRequests(): Promise<AdminRequest[]> {
    try {
      // Fetch requests from all statuses
      const statuses = Object.values(RequestLifecycle) as RequestLifecycle[];
      const allRequests: AdminRequest[] = [];
      
      for (const status of statuses) {
        try {
          const requests = await this.getRequestsByStatus(status);
          allRequests.push(...requests);
        } catch (error) {
          console.warn(`Failed to fetch requests for status ${status}:`, error);
        }
      }
      
      // Remove duplicates by id
      const uniqueRequests = allRequests.filter((request, index, self) =>
        index === self.findIndex((r) => r.id === request.id)
      );
      
      return uniqueRequests;
    } catch (error) {
      console.error('Failed to fetch all requests:', error);
      return [];
    }
  },

  // Filter requests
  async filterRequests(filters: {
    citizenId?: number;
    type?: RequestType;
    status?: RequestLifecycle;
  }): Promise<AdminRequest[]> {
    const params = new URLSearchParams();
    if (filters.citizenId) params.append('citizenId', filters.citizenId.toString());
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);

    return apiFetch<AdminRequest[]>(API_ENDPOINTS.filterRequests(params), {
      method: 'GET',
    });
  },

  // Start review
  async startReview(id: number, dto: UpdateStatusDTO): Promise<AdminRequest> {
    return apiFetch<AdminRequest>(API_ENDPOINTS.startReview(id), {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },

  // Approve request
  async approve(id: number, dto: UpdateStatusDTO): Promise<AdminRequest> {
    return apiFetch<AdminRequest>(API_ENDPOINTS.approve(id), {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },

  // Reject request
  async reject(id: number, dto: UpdateStatusDTO): Promise<AdminRequest> {
    return apiFetch<AdminRequest>(API_ENDPOINTS.reject(id), {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },

  // Complete request
  async complete(id: number, dto: UpdateStatusDTO): Promise<AdminRequest> {
    return apiFetch<AdminRequest>(API_ENDPOINTS.complete(id), {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },

  // Add attachment
  async addAttachment(id: number, file: File): Promise<AdminRequest> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiUpload<AdminRequest>(API_ENDPOINTS.addAttachment(id), formData);
  },

  // Get request history
  async getHistory(id: number): Promise<RequestHistory[]> {
    return apiFetch<RequestHistory[]>(API_ENDPOINTS.getHistory(id), {
      method: 'GET',
    });
  },

  // Get status summary
  async getStatusSummary(id: number): Promise<AdminRequestStatusDTO> {
    return apiFetch<AdminRequestStatusDTO>(API_ENDPOINTS.getStatusSummary(id), {
      method: 'GET',
    });
  },
};
