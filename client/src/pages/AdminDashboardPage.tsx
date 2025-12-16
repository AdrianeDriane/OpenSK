import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  AdminHeader,
  StatsCards,
  VerificationRequestsTable,
  DocumentPreviewPanel,
  RejectModal,
  ApproveModal,
} from "../components/adminDashboardPage";
import {
  getDashboardStats,
  getVerificationRequests,
  approveVerificationRequest,
  rejectVerificationRequest,
  type DashboardStats,
  type VerificationRequest,
} from "../api/admin";

export function AdminDashboardPage() {
  // Get user info from localStorage
  const authUser = localStorage.getItem("auth_user");
  const user = authUser ? JSON.parse(authUser) : null;

  // State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Document Preview Panel state
  const [previewRequest, setPreviewRequest] =
    useState<VerificationRequest | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Reject Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingRequest, setRejectingRequest] =
    useState<VerificationRequest | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  // Approve Modal state
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approvingRequest, setApprovingRequest] =
    useState<VerificationRequest | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.href = "/login";
  };

  // Fetch data
  const fetchStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoadingRequests(true);
      const data = await getVerificationRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, [fetchStats, fetchRequests]);

  // Handlers
  const handleViewDocuments = (request: VerificationRequest) => {
    setPreviewRequest(request);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setTimeout(() => setPreviewRequest(null), 300); // Clear after animation
  };

  const handleApprove = (id: number) => {
    const request = requests.find((r) => r.id === id);
    if (request) {
      setApprovingRequest(request);
      setApproveModalOpen(true);
    }
  };

  const handleApproveConfirm = async () => {
    if (!approvingRequest) return;

    try {
      setIsApproving(true);
      setProcessingId(approvingRequest.id);
      await approveVerificationRequest(approvingRequest.id);
      setApproveModalOpen(false);
      setApprovingRequest(null);
      toast.success("Verification request approved successfully!");
      // Refresh data
      await Promise.all([fetchStats(), fetchRequests()]);
    } catch (error) {
      console.error("Failed to approve request:", error);
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Failed to approve request. Please try again.";
      toast.error(message);
    } finally {
      setIsApproving(false);
      setProcessingId(null);
    }
  };

  const handleApproveModalClose = () => {
    if (!isApproving) {
      setApproveModalOpen(false);
      setApprovingRequest(null);
    }
  };

  const handleRejectClick = (id: number) => {
    const request = requests.find((r) => r.id === id);
    if (request) {
      setRejectingRequest(request);
      setRejectModalOpen(true);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectingRequest) return;

    try {
      setIsRejecting(true);
      await rejectVerificationRequest(rejectingRequest.id, reason);
      setRejectModalOpen(false);
      setRejectingRequest(null);
      toast.success("Verification request rejected.");
      // Refresh data
      await Promise.all([fetchStats(), fetchRequests()]);
    } catch (error) {
      console.error("Failed to reject request:", error);
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Failed to reject request. Please try again.";
      toast.error(message);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleRejectModalClose = () => {
    if (!isRejecting) {
      setRejectModalOpen(false);
      setRejectingRequest(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <AdminHeader user={user} onLogout={handleLogout} />

      <main className="grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-[#203972] font-serif mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage verification requests and oversee all registered barangays.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <StatsCards stats={stats} isLoading={isLoadingStats} />

          {/* Verification Requests Table */}
          <VerificationRequestsTable
            requests={requests}
            isLoading={isLoadingRequests}
            onViewDocuments={handleViewDocuments}
            onApprove={handleApprove}
            onReject={handleRejectClick}
            processingId={processingId}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            OpenSK Admin Panel © {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Document Preview Panel */}
      <DocumentPreviewPanel
        isOpen={isPreviewOpen}
        request={previewRequest}
        onClose={handleClosePreview}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModalOpen}
        applicantName={
          rejectingRequest
            ? `${rejectingRequest.user.firstName} ${rejectingRequest.user.lastName}`
            : ""
        }
        onClose={handleRejectModalClose}
        onConfirm={handleRejectConfirm}
        isLoading={isRejecting}
      />

      {/* Approve Modal */}
      <ApproveModal
        isOpen={approveModalOpen}
        applicantName={
          approvingRequest
            ? `${approvingRequest.user.firstName} ${approvingRequest.user.lastName}`
            : ""
        }
        barangayName={approvingRequest?.barangay?.name || ""}
        onClose={handleApproveModalClose}
        onConfirm={handleApproveConfirm}
        isLoading={isApproving}
      />
    </div>
  );
}
