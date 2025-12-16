import api from "./axios";

// =============================================================================
// Types
// =============================================================================

export interface DashboardStats {
  pendingVerifications: number;
  approvedBarangays: number;
  rejectedRequests: number;
  totalSKOfficials: number;
}

export interface VerificationDocument {
  id: number;
  fileUrl: string;
  type: {
    id: number;
    name: string;
  };
}

export interface VerificationRequest {
  id: number;
  remarks: string | null;
  rejectionReason: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    verified: boolean;
    barangay?: {
      id: number;
      name: string;
    } | null;
  };
  barangay: {
    id: number;
    name: string;
  } | null;
  status: {
    id: number;
    name: string;
  };
  documents: VerificationDocument[];
  reviewer?: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Fetch dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>("/admin/stats");
  return response.data;
}

/**
 * Fetch all verification requests
 * @param status - Optional filter: 'pending', 'approved', 'rejected'
 */
export async function getVerificationRequests(
  status?: "pending" | "approved" | "rejected"
): Promise<VerificationRequest[]> {
  const params = status ? { status } : {};
  const response = await api.get<VerificationRequest[]>(
    "/admin/verification-requests",
    { params }
  );
  return response.data;
}

/**
 * Fetch a single verification request by ID
 */
export async function getVerificationRequestById(
  id: number
): Promise<VerificationRequest> {
  const response = await api.get<VerificationRequest>(
    `/admin/verification-requests/${id}`
  );
  return response.data;
}

/**
 * Approve a verification request
 */
export async function approveVerificationRequest(
  id: number
): Promise<{ message: string; request: VerificationRequest }> {
  const response = await api.patch<{
    message: string;
    request: VerificationRequest;
  }>(`/admin/verification-requests/${id}/approve`);
  return response.data;
}

/**
 * Reject a verification request
 */
export async function rejectVerificationRequest(
  id: number,
  reason: string
): Promise<{ message: string; request: VerificationRequest }> {
  const response = await api.patch<{
    message: string;
    request: VerificationRequest;
  }>(`/admin/verification-requests/${id}/reject`, { reason });
  return response.data;
}
