import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  User,
  MapPin,
  Calendar,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";
import type {
  VerificationRequest,
  VerificationDocument,
} from "../../api/admin";

interface DocumentPreviewPanelProps {
  isOpen: boolean;
  request: VerificationRequest | null;
  onClose: () => void;
}

export function DocumentPreviewPanel({
  isOpen,
  request,
  onClose,
}: DocumentPreviewPanelProps) {
  const [selectedDocument, setSelectedDocument] =
    useState<VerificationDocument | null>(null);
  const [zoom, setZoom] = useState(100);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  // Reset selected document when panel opens with new request
  const handleDocumentSelect = (doc: VerificationDocument) => {
    setSelectedDocument(doc);
    setZoom(100);
  };

  const isImageFile = (url: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
    return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  const isPdfFile = (url: string) => {
    return url.toLowerCase().includes(".pdf");
  };

  return (
    <AnimatePresence>
      {isOpen && request && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-[#203972]">
                  Verification Documents
                </h2>
                <p className="text-sm text-gray-500">Request #{request.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Applicant Info */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      {request.user.firstName} {request.user.lastName}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      {request.barangay?.name || "No barangay"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm col-span-2">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      Submitted: {formatDate(request.submittedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents List */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Submitted Documents ({request.documents.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {request.documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => handleDocumentSelect(doc)}
                      className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
                        selectedDocument?.id === doc.id
                          ? "bg-[#203972] text-white border-[#203972]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#203972] hover:text-[#203972]"
                      }`}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        {doc.type.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Preview Area */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {selectedDocument ? (
                  <>
                    {/* Preview Controls */}
                    <div className="px-6 py-2 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                      <span className="text-sm font-medium text-gray-700">
                        {selectedDocument.type.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleZoomOut}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={handleResetZoom}
                          className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        >
                          {zoom}%
                        </button>
                        <button
                          onClick={handleZoomIn}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="w-px h-5 bg-gray-300 mx-2" />
                        <a
                          href={selectedDocument.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Open in New Tab"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </a>
                        <a
                          href={selectedDocument.fileUrl}
                          download
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </a>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 overflow-auto bg-gray-100 p-4">
                      <div
                        className="flex items-center justify-center min-h-full"
                        style={{
                          transform: `scale(${zoom / 100})`,
                          transformOrigin: "top center",
                        }}
                      >
                        {isImageFile(selectedDocument.fileUrl) ? (
                          <img
                            src={selectedDocument.fileUrl}
                            alt={selectedDocument.type.name}
                            className="max-w-full h-auto rounded-lg shadow-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='Arial' font-size='16' text-anchor='middle' x='200' y='150'%3EImage failed to load%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        ) : isPdfFile(selectedDocument.fileUrl) ? (
                          <iframe
                            src={selectedDocument.fileUrl}
                            title={selectedDocument.type.name}
                            className="w-full h-full min-h-[600px] rounded-lg shadow-lg bg-white"
                          />
                        ) : (
                          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">
                              Preview not available for this file type.
                            </p>
                            <a
                              href={selectedDocument.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-[#203972] text-white rounded-lg hover:bg-[#152a5c] transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Open File
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Select a document to preview
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
