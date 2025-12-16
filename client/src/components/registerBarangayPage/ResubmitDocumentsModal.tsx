import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, Loader2, RefreshCw } from "lucide-react";
import { AxiosError } from "axios";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface VerificationRequest {
  id: number;
  status: { name: string };
  submittedAt: string;
  remarks: string | null;
  rejectionReason: string | null;
  barangay: { id: number; name: string } | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  documents: Array<{
    id: number;
    fileUrl: string;
    type: { name: string };
  }>;
}

interface ResubmitDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (request: VerificationRequest) => void;
}

export function ResubmitDocumentsModal({
  isOpen,
  onClose,
  onSuccess,
}: ResubmitDocumentsModalProps) {
  const [validIdFile, setValidIdFile] = useState<File | null>(null);
  const [supportingDocType, setSupportingDocType] = useState(
    "Certificate of Incumbency"
  );
  const [supportingDocFile, setSupportingDocFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form
      setValidIdFile(null);
      setSupportingDocFile(null);
      setSupportingDocType("Certificate of Incumbency");
    }
  };

  const handleSubmit = async () => {
    if (!validIdFile) {
      toast.error("Please upload a Valid ID.");
      return;
    }
    if (!supportingDocFile) {
      toast.error("Please upload a supporting document.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("validId", validIdFile);
      formData.append("supportingDocType", supportingDocType);
      formData.append("supportingDoc", supportingDocFile);

      const res = await api.patch("/verification-requests/resubmit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Documents resubmitted successfully!");
      onSuccess(res.data.request);
      handleClose();
    } catch (err: unknown) {
      console.error(err);
      const axiosError = err as AxiosError<{ error: string }>;
      const message =
        axiosError.response?.data?.error || "Failed to resubmit documents.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-[#203972]" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Resubmit Documents
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 space-y-6">
                <p className="text-sm text-gray-600">
                  Upload new verification documents to resubmit your request.
                  Make sure to address the issues mentioned in the rejection
                  reason.
                </p>

                {/* Valid ID Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Government ID{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="resubmit-valid-id"
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                    disabled={isSubmitting}
                    onChange={(e) =>
                      setValidIdFile(e.target.files?.[0] || null)
                    }
                  />
                  <label
                    htmlFor="resubmit-valid-id"
                    className={`block border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                      validIdFile
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 hover:border-[#203972] bg-gray-50 hover:bg-blue-50"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="mx-auto h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                      <Upload
                        className={`h-4 w-4 ${
                          validIdFile ? "text-green-600" : "text-[#203972]"
                        }`}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {validIdFile ? "✓ File Selected" : "Upload Valid ID"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {validIdFile ? validIdFile.name : "PNG, JPG, PDF up to 5MB"}
                    </p>
                  </label>
                </div>

                {/* Supporting Document Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Document Type{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={supportingDocType}
                    onChange={(e) => setSupportingDocType(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border rounded-md focus:ring-[#203972] focus:border-[#203972] disabled:opacity-50"
                  >
                    <option value="Certificate of Incumbency">
                      Certificate of Incumbency
                    </option>
                    <option value="Certificate of Proclamation">
                      Certificate of Proclamation
                    </option>
                    <option value="Oath of Office">Oath of Office</option>
                  </select>
                </div>

                {/* Supporting Document Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload {supportingDocType}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="resubmit-supporting-doc"
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                    disabled={isSubmitting}
                    onChange={(e) =>
                      setSupportingDocFile(e.target.files?.[0] || null)
                    }
                  />
                  <label
                    htmlFor="resubmit-supporting-doc"
                    className={`block border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                      supportingDocFile
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 hover:border-[#203972] bg-gray-50 hover:bg-blue-50"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="mx-auto h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                      <FileText
                        className={`h-4 w-4 ${
                          supportingDocFile ? "text-green-600" : "text-[#203972]"
                        }`}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {supportingDocFile
                        ? "✓ File Selected"
                        : `Upload ${supportingDocType}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {supportingDocFile
                        ? supportingDocFile.name
                        : "PNG, JPG, PDF up to 5MB"}
                    </p>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200 sticky bottom-0">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !validIdFile || !supportingDocFile}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#203972] hover:bg-[#152a5c] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resubmit Documents
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
