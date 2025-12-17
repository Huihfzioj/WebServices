// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_REQUESTS_PATH = '/api/requests';

export const API_ENDPOINTS = {
  // Request endpoints
  createRequest: () => `${API_BASE_URL}${API_REQUESTS_PATH}`,
  getRequest: (id: number) => `${API_BASE_URL}${API_REQUESTS_PATH}/${id}`,
  getRequestsByCitizen: (citizenId: number) => `${API_BASE_URL}${API_REQUESTS_PATH}/citizen/${citizenId}`,
  getRequestsByStatus: (status: string) => `${API_BASE_URL}${API_REQUESTS_PATH}/status/${status}`,
  filterRequests: (params: URLSearchParams) => `${API_BASE_URL}${API_REQUESTS_PATH}/filter?${params.toString()}`,
  startReview: (id: number) => `${API_BASE_URL}${API_REQUESTS_PATH}/${id}/start-review`,
  approve: (id: number) => `${API_BASE_URL}${API_REQUESTS_PATH}/${id}/approve`,
  reject: (id: number) => `${API_BASE_URL}${API_REQUESTS_PATH}/${id}/reject`,
  complete: (id: number) => `${API_BASE_URL}${API_REQUESTS_PATH}/${id}/complete`,
  addAttachment: (id: number) => `${API_BASE_URL}${API_REQUESTS_PATH}/${id}/attachments`,
  getHistory: (id: number) => `${API_BASE_URL}${API_REQUESTS_PATH}/${id}/history`,
  getStatusSummary: (id: number) => `${API_BASE_URL}${API_REQUESTS_PATH}/${id}/status-summary`,
};

// Generic fetch wrapper with error handling
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    console.log(`[API] ${options?.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    console.log(`[API Response] ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      const errorMsg = `API Error: ${response.status} - ${errorText}`;
      console.error('[API Error]', errorMsg);
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log('[API Success]', data);
    return data;
  } catch (error) {
    console.error('[API Fetch Error]', error);
    throw error;
  }
}

// Multipart form data wrapper for file uploads
export async function apiUpload<T>(
  url: string,
  formData: FormData
): Promise<T> {
  try {
    console.log(`[API] POST ${url} (multipart)`);
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    console.log(`[API Response] ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      const errorMsg = `API Error: ${response.status} - ${errorText}`;
      console.error('[API Error]', errorMsg);
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log('[API Success]', data);
    return data;
  } catch (error) {
    console.error('[API Upload Error]', error);
    throw error;
  }
}
