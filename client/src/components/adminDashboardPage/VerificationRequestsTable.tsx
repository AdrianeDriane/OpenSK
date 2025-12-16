import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";
import type { VerificationRequest } from "../../api/admin";

interface VerificationRequestsTableProps {
  requests: VerificationRequest[];
  isLoading: boolean;
  onViewDocuments: (request: VerificationRequest) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  processingId: number | null;
}

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  Approved: { bg: "bg-green-100", text: "text-green-800" },
  Rejected: { bg: "bg-red-100", text: "text-red-800" },
};

export function VerificationRequestsTable({
  requests,
  isLoading,
  onViewDocuments,
  onApprove,
  onReject,
  processingId,
}: VerificationRequestsTableProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filteredRequests = requests.filter((req) => {
    if (statusFilter === "all") return true;
    return req.status.name.toLowerCase() === statusFilter;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#203972]" />
          <span className="ml-3 text-gray-600">
            Loading verification requests...
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-[#203972]">
            Verification Requests
          </h2>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Filter:</span>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {(
                ["all", "pending", "approved", "rejected"] as StatusFilter[]
              ).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    statusFilter === filter
                      ? "bg-[#203972] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredRequests.length === 0 ? (
        <div className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No verification requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Barangay
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((request) => {
                const isExpanded = expandedRow === request.id;
                const statusColor = STATUS_COLORS[request.status.name] || {
                  bg: "bg-gray-100",
                  text: "text-gray-800",
                };
                const isPending = request.status.name === "Pending";
                const isProcessing = processingId === request.id;

                return (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleRow(request.id)}
                          className="mr-2 p-1 hover:bg-gray-100 rounded"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <div>
                          <p className="font-medium text-gray-900">
                            {request.user.firstName} {request.user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.user.email}
                          </p>
                        </div>
                      </div>
                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 pl-8 space-y-2 overflow-hidden"
                          >
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-2" />
                              {request.user.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {request.barangay?.name || "No barangay assigned"}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FileText className="w-4 h-4 mr-2" />
                              {request.documents.length} document(s) submitted
                            </div>
                            {request.remarks && (
                              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                <span className="font-medium">Remarks:</span>{" "}
                                {request.remarks}
                              </div>
                            )}
                            {request.rejectionReason && (
                              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                <span className="font-medium">
                                  Rejection Reason:
                                </span>{" "}
                                {request.rejectionReason}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">
                        {request.barangay?.name || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {formatDate(request.submittedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
                      >
                        {request.status.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        {/* View Documents Button */}
                        <button
                          onClick={() => onViewDocuments(request)}
                          className="p-2 text-gray-600 hover:text-[#203972] hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Documents"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Approve/Reject Buttons (only for pending) */}
                        {isPending && (
                          <>
                            <button
                              onClick={() => onApprove(request.id)}
                              disabled={isProcessing}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => onReject(request.id)}
                              disabled={isProcessing}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
