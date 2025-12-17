export enum RequestType {
  BIRTH_CERTIFICATE = "BIRTH_CERTIFICATE",
  DEATH_CERTIFICATE = "DEATH_CERTIFICATE",
  MARRIAGE_CERTIFICATE = "MARRIAGE_CERTIFICATE",
  RESIDENCY_CERTIFICATE = "RESIDENCY_CERTIFICATE",
  PASSPORT_RENEWAL = "PASSPORT_RENEWAL",
  DRIVERS_LICENSE = "DRIVERS_LICENSE",
  BUSINESS_REGISTRATION = "BUSINESS_REGISTRATION",
  BUILDING_PERMIT = "BUILDING_PERMIT",
  TAX_CERTIFICATE = "TAX_CERTIFICATE",
}

export enum RequestLifecycle {
  PENDING = "PENDING",
  IN_REVIEW = "IN_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export interface RequestHistory {
  id: number;
  requestId?: number;
  oldStatus?: RequestLifecycle;
  newStatus: RequestLifecycle;
  actionComment?: string;
  timestamp: string;
  processingOffice?: string;
  // Aliases for backward compatibility
  status?: RequestLifecycle;
  comment?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface AdminRequest {
  id?: number;
  citizenID: number;
  type: RequestType;
  status: RequestLifecycle;
  createdAt?: string;
  updatedAt?: string;
  comment: string;
  decisionReason?: string;
  processingOffice?: string;
  attachments: string[];
  history: RequestHistory[];
}

export interface UpdateStatusDTO {
  decisionReason: string;
  processingOffice: string;
  comment: string;
}

export interface CreateRequestDTO {
  citizenId: number;
  type: RequestType;
  comment: string;
  attachments: string[];
}

export interface AdminRequestStatusDTO {
  id: number;
  citizenID: number;
  type: RequestType;
  status: RequestLifecycle;
  createdAt: string;
  updatedAt: string;
  comment: string;
  decisionReason?: string;
  processingOffice?: string;
}

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  [RequestType.BIRTH_CERTIFICATE]: "Birth Certificate",
  [RequestType.DEATH_CERTIFICATE]: "Death Certificate",
  [RequestType.MARRIAGE_CERTIFICATE]: "Marriage Certificate",
  [RequestType.RESIDENCY_CERTIFICATE]: "Residency Certificate",
  [RequestType.PASSPORT_RENEWAL]: "Passport Renewal",
  [RequestType.DRIVERS_LICENSE]: "Driver's License",
  [RequestType.BUSINESS_REGISTRATION]: "Business Registration",
  [RequestType.BUILDING_PERMIT]: "Building Permit",
  [RequestType.TAX_CERTIFICATE]: "Tax Certificate",
};

export const REQUEST_TYPE_DESCRIPTIONS: Record<RequestType, string> = {
  [RequestType.BIRTH_CERTIFICATE]: "Request a copy of your birth certificate",
  [RequestType.DEATH_CERTIFICATE]: "Request a death certificate",
  [RequestType.MARRIAGE_CERTIFICATE]: "Request a marriage certificate copy",
  [RequestType.RESIDENCY_CERTIFICATE]: "Obtain proof of residence documentation",
  [RequestType.PASSPORT_RENEWAL]: "Renew your passport",
  [RequestType.DRIVERS_LICENSE]: "Apply for or renew your driver's license",
  [RequestType.BUSINESS_REGISTRATION]: "Register a new business",
  [RequestType.BUILDING_PERMIT]: "Apply for construction or renovation permits",
  [RequestType.TAX_CERTIFICATE]: "Request tax clearance or compliance certificates",
};

export const STATUS_LABELS: Record<RequestLifecycle, string> = {
  [RequestLifecycle.PENDING]: "Pending",
  [RequestLifecycle.IN_REVIEW]: "In Review",
  [RequestLifecycle.APPROVED]: "Approved",
  [RequestLifecycle.REJECTED]: "Rejected",
  [RequestLifecycle.COMPLETED]: "Completed",
};

export const STATUS_COLORS: Record<RequestLifecycle, string> = {
  [RequestLifecycle.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [RequestLifecycle.IN_REVIEW]: "bg-blue-100 text-blue-800 border-blue-200",
  [RequestLifecycle.APPROVED]: "bg-green-100 text-green-800 border-green-200",
  [RequestLifecycle.REJECTED]: "bg-red-100 text-red-800 border-red-200",
  [RequestLifecycle.COMPLETED]: "bg-emerald-100 text-emerald-800 border-emerald-200",
};
