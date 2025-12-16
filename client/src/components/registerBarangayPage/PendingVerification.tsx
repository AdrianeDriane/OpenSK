import { motion } from "framer-motion";
import { Clock, FileCheck, Mail, LogOut } from "lucide-react";
import SKLogo from "../../assets/icons/sk_logo.png";

interface VerificationRequest {
  id: number;
  status: { name: string };
  submittedAt: string;
  remarks: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    barangay: { id: number; name: string } | null;
  };
  documents: Array<{
    id: number;
    fileUrl: string;
    type: { name: string };
  }>;
}

interface PendingVerificationProps {
  request: VerificationRequest;
}

export function PendingVerification({ request }: PendingVerificationProps) {
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.href = "/login";
  };

  const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
    Pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "text-yellow-500" },
    Approved: { bg: "bg-green-100", text: "text-green-800", icon: "text-green-500" },
    Rejected: { bg: "bg-red-100", text: "text-red-800", icon: "text-red-500" },
  };

  const statusStyle = statusColors[request.status.name] || statusColors.Pending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center py-12 px-4 font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center"
      >
        <div className="w-12 h-12 bg-[#203972] rounded-full flex items-center justify-center mr-3">
          <img src={SKLogo} className="w-10 h-10" alt="SK Logo" />
        </div>
        <span className="text-2xl font-bold text-[#203972] font-serif tracking-tight">
          OpenSK
        </span>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        {/* Status Banner */}
        <div className={`${statusStyle.bg} px-6 py-4 flex items-center justify-center gap-3`}>
          <Clock className={`w-6 h-6 ${statusStyle.icon}`} />
          <span className={`text-lg font-semibold ${statusStyle.text}`}>
            Verification {request.status.name}
          </span>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {request.status.name === "Pending"
                ? "Your registration is being reviewed"
                : request.status.name === "Rejected"
                ? "Your registration was not approved"
                : "Your registration has been approved"}
            </h1>
            <p className="text-gray-600">
              {request.status.name === "Pending"
                ? "Please wait while an administrator verifies your documents. This usually takes 1-3 business days."
                : request.status.name === "Rejected"
                ? "Please contact the administrator for more information."
                : "You can now access the dashboard."}
            </p>
          </div>

          {/* Request Details */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#203972]" />
              Request Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Full Name</span>
                <span className="text-gray-900 font-medium">
                  {request.user.firstName} {request.user.lastName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900 font-medium">{request.user.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Barangay</span>
                <span className="text-gray-900 font-medium">
                  {request.user.barangay?.name || "Not assigned"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Submitted</span>
                <span className="text-gray-900 font-medium">
                  {new Date(request.submittedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Documents</span>
                <span className="text-gray-900 font-medium">
                  {request.documents.length} uploaded
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#203972] mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-gray-700">
                Questions about your application? Contact the administrator at{" "}
                <a
                  href="mailto:support@opensk.ph"
                  className="text-[#203972] font-medium hover:underline"
                >
                  support@opensk.ph
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign out and return later
          </button>
        </div>
      </motion.div>

      {/* Footer Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-sm text-gray-500 text-center"
      >
        You'll receive an email notification once your application is reviewed.
      </motion.p>
    </div>
  );
}
