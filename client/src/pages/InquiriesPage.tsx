import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { DashboardHeader } from "../components/skDashboardPage/DashboardHeader";
import { Footer } from "../components/landingPage/Footer";

interface Inquiry {
  id: number;
  senderFirstName: string | null;
  senderLastName: string | null;
  senderEmail: string | null;
  subject: string;
  message: string;
  createdAt: string;
  status: {
    name: string;
  };
  responder: {
    firstName: string;
    lastName: string;
  } | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function InquiriesPage() {
  const [activeTab, setActiveTab] = useState<"Open" | "Resolved">("Open");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [confirmResolve, setConfirmResolve] = useState<number | null>(null);
  const [barangayName, setBarangayName] = useState<string>("");

  useEffect(() => {
    fetchInquiries();
  }, [activeTab, pagination.page]);

  useEffect(() => {
    // Get barangay name from user data or token
    const fetchBarangayName = async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.data.barangay) {
          setBarangayName(response.data.barangay.name);
        }
      } catch (error) {
        console.error("Failed to fetch barangay name:", error);
      }
    };
    fetchBarangayName();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/inquiries", {
        params: {
          status: activeTab,
          page: pagination.page,
          limit: pagination.limit,
        },
      });

      if (response.data.success) {
        setInquiries(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to load inquiries. Please try again.");
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolvInquiry = async (id: number) => {
    try {
      const response = await api.patch(`/inquiries/${id}/resolve`);

      if (response.data.success) {
        toast.success("Inquiry marked as resolved!");
        setConfirmResolve(null);
        fetchInquiries(); // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to resolve inquiry. Please try again.");
      console.error("Error resolving inquiry:", error);
    }
  };

  const handleEmailResponse = (inquiry: Inquiry) => {
    const to = inquiry.senderEmail || "";
    const subject = `Re: ${inquiry.subject} - SK ${barangayName} Response`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      to
    )}&su=${encodeURIComponent(subject)}`;
    window.open(gmailUrl, "_blank");
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Toaster position="top-right" />
      <DashboardHeader />

      <main className="grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-[#203972] font-serif mb-2">
              Inquiries Management
            </h1>
            <p className="text-gray-600">
              View and respond to inquiries from your constituents.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab("Open");
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "Open"
                  ? "text-[#203972]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Clock className="inline-block w-4 h-4 mr-2" />
              Open
              {activeTab === "Open" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#203972]"
                />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("Resolved");
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "Resolved"
                  ? "text-[#203972]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <CheckCircle className="inline-block w-4 h-4 mr-2" />
              Resolved
              {activeTab === "Resolved" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#203972]"
                />
              )}
            </button>
          </div>

          {/* Inquiries List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-[#203972] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-500">
                No {activeTab.toLowerCase()} inquiries found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry, index) => (
                <motion.div
                  key={inquiry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {inquiry.subject}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            inquiry.status.name === "Open"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {inquiry.status.name}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-1">
                        <strong>From:</strong>{" "}
                        {inquiry.senderFirstName && inquiry.senderLastName
                          ? `${inquiry.senderFirstName} ${inquiry.senderLastName}`
                          : "Anonymous"}
                        {inquiry.senderEmail && (
                          <span className="ml-2 text-gray-500">
                            ({inquiry.senderEmail})
                          </span>
                        )}
                      </p>

                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Date:</strong> {formatDate(inquiry.createdAt)}
                      </p>

                      <p className="text-gray-700 mb-4">{inquiry.message}</p>

                      {inquiry.responder && (
                        <p className="text-sm text-gray-500 italic">
                          Resolved by {inquiry.responder.firstName}{" "}
                          {inquiry.responder.lastName}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleEmailResponse(inquiry)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#203972] text-white rounded-lg hover:bg-[#1a2e5a] transition-colors text-sm font-medium"
                      >
                        <Mail className="w-4 h-4" />
                        Respond
                      </button>

                      {activeTab === "Open" && (
                        <button
                          onClick={() => setConfirmResolve(inquiry.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} inquiries
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.page) <= 1
                    )
                    .map((page, index, array) => {
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <span
                            key={`ellipsis-${page}`}
                            className="px-4 py-2 text-gray-500"
                          >
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            pagination.page === page
                              ? "bg-[#203972] text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Dialog */}
      {confirmResolve !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Confirm Resolution
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this inquiry as resolved? This
              action will move it to the Resolved tab.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmResolve(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolvInquiry(confirmResolve)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
