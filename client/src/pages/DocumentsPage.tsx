import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { DashboardHeader } from "../components/skDashboardPage/DashboardHeader";
import api from "../api/axios";
import { FileText, Trash2, UploadCloud, Eye, AlertCircle } from "lucide-react";
import { Footer } from "../components/landingPage/Footer";

type DocumentType = { id: number; name: string };
type Document = {
  id: number;
  title: string;
  description?: string | null;
  year?: number | null;
  fileUrl: string;
  createdAt?: string | null;
  typeId: number;
};

export function DocumentsPage() {
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [confirmDocId, setConfirmDocId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [previewDocId, setPreviewDocId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Record<number, string>>(
    {}
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/documents");
      const fetchedTypes: DocumentType[] = res.data.types || [];
      const fetchedDocs: Document[] = res.data.documents || [];
      setTypes(fetchedTypes);
      setDocuments(fetchedDocs);
      if (fetchedDocs.length > 0) {
        setSelectedDocId((prev) => prev ?? fetchedDocs[0].id);
      } else {
        setSelectedDocId(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (typeId: number, form: HTMLFormElement) => {
    const fd = new FormData(form);
    fd.append("typeId", String(typeId));

    const fileInput = form.querySelector(
      "input[name='file']"
    ) as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    if (!file) {
      toast.error("Please choose a file");
      return;
    }

    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    const maxBytes = 25 * 1024 * 1024;
    if (!isPdf && !isImage) {
      toast.error("Only PDF or image files are allowed");
      return;
    }
    if (file.size > maxBytes) {
      toast.error("File must be 25MB or smaller");
      return;
    }

    setUploading(true);
    try {
      await api.post("/documents", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Document uploaded");
      await load();
      form.reset();
      setSelectedFiles((prev) => ({ ...prev, [typeId]: "" }));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleting(true);
      await api.delete(`/documents/${id}`);
      toast.success("Document deleted");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete document");
    } finally {
      setDeleting(false);
      setConfirmDocId(null);
    }
  };

  const grouped = types.map((t) => ({
    type: t,
    items: documents.filter((d) => d.typeId === t.id),
  }));

  // const selectedDoc = useMemo(
  //   () => documents.find((d) => d.id === selectedDocId) || null,
  //   [documents, selectedDocId]
  // );

  const confirmDoc = useMemo(
    () => documents.find((d) => d.id === confirmDocId) || null,
    [documents, confirmDocId]
  );

  const previewDoc = useMemo(
    () => documents.find((d) => d.id === previewDocId) || null,
    [documents, previewDocId]
  );

  const renderPreview = (doc: Document | null) => {
    if (!doc) {
      return (
        <div className="text-sm text-gray-500 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>Select a document to preview</span>
        </div>
      );
    }

    const lowerUrl = doc.fileUrl.toLowerCase();
    const isPdf = lowerUrl.includes(".pdf");
    const isImage = /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(lowerUrl);

    if (isImage) {
      return (
        <img
          src={doc.fileUrl}
          alt={doc.title}
          className="w-full h-[420px] object-contain rounded-lg border border-gray-100"
        />
      );
    }

    if (isPdf) {
      return (
        <iframe
          title={doc.title}
          src={doc.fileUrl}
          className="w-full h-[70vh] rounded-lg border border-gray-100 bg-white"
        />
      );
    }

    return (
      <div className="text-sm text-gray-600">
        <p className="font-semibold text-gray-900">{doc.title}</p>
        <p className="mt-2">Preview unavailable for this file type.</p>
        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center mt-3 text-[#203972] hover:underline"
        >
          <Eye className="w-4 h-4 mr-2" />
          Open in new tab
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <DashboardHeader />
      <main className="grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-[#203972] font-serif mb-2">
              Documents
            </h1>
            <p className="text-gray-600">
              Upload and manage official barangay documents.
            </p>
          </motion.div>
          <div className="space-y-8">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-gray-100 rounded-xl p-4 text-sm text-gray-600 shadow-sm flex items-center space-x-2"
              >
                <span className="w-2.5 h-2.5 bg-[#203972] rounded-full animate-pulse" />
                <span>Loading documents…</span>
              </motion.div>
            )}

            {grouped.map(({ type, items }, idx) => (
              <motion.section
                key={type.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="px-6 pt-6 pb-2 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {type.name}
                  </h2>
                </div>

                <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-3">
                    {items.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No documents uploaded yet.
                      </p>
                    )}
                    {items.map((doc) => (
                      <motion.div
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        whileHover={{ scale: 1.01, x: 4 }}
                        className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition cursor-pointer ${
                          selectedDocId === doc.id
                            ? "border-[#203972] bg-[#203972]/5"
                            : "border-gray-100 bg-gray-50 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-[#203972]" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {doc.title}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-2">
                              {doc.year ? `Year: ${doc.year}` : "No year"}
                              {doc.description ? ` • ${doc.description}` : ""}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewDocId(doc.id);
                            }}
                            className="text-xs text-[#203972] hover:underline"
                          >
                            Preview
                          </button>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-[#203972] hover:underline"
                          >
                            Open
                          </a>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDocId(doc.id);
                            }}
                            className="text-red-600 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50"
                            aria-label="Delete document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div>
                    <form
                      className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpload(type.id, e.currentTarget);
                      }}
                    >
                      <div className="flex items-center mb-1">
                        <div className="w-10 h-10 rounded-lg bg-[#203972]/10 text-[#203972] flex items-center justify-center mr-3">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Add New
                          </p>
                          <p className="text-xs text-gray-500">
                            Upload PDF or image files.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="text-xs text-gray-600">Title</label>
                          <input
                            name="title"
                            required
                            placeholder="e.g., ABYIP 2025"
                            className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#203972]/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">
                            Description
                          </label>
                          <textarea
                            name="description"
                            required
                            placeholder="Brief notes or context"
                            className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#203972]/30"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-600">
                              Year
                            </label>
                            <input
                              name="year"
                              type="number"
                              min="1900"
                              max="2100"
                              required
                              placeholder="YYYY"
                              className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#203972]/30"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">File</label>
                          <label className="relative mt-2 border border-dashed border-[#203972]/30 rounded-xl bg-white p-4 hover:border-[#203972]/60 transition cursor-pointer block">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-[#203972]/10 text-[#203972] flex items-center justify-center">
                                <UploadCloud className="w-5 h-5" />
                              </div>
                              <div>
                                {selectedFiles[type.id] ? (
                                  <>
                                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
                                      {selectedFiles[type.id]}
                                    </p>
                                    <p className="text-xs text-green-600">
                                      File selected. Click to change.
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-sm font-semibold text-gray-900">
                                      Drop file here or click
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      PDF or image only. Max 25MB.
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                            <input
                              name="file"
                              type="file"
                              accept="application/pdf,image/*"
                              required
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                setSelectedFiles((prev) => ({
                                  ...prev,
                                  [type.id]: file?.name || "",
                                }));
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <button
                        disabled={uploading}
                        className="w-full bg-[#203972] text-white rounded-md px-3 py-2 text-sm font-semibold hover:bg-[#1a2e5a] disabled:opacity-60"
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.section>
            ))}

            {/* Preview overlay triggered via button; inline preview removed for cleaner layout */}
          </div>
        </div>
      </main>
      <AnimatePresence>
        {confirmDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete document?
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This will permanently delete{" "}
                    <span className="font-semibold">{confirmDoc.title}</span>.
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setConfirmDocId(null)}
                  className="px-4 py-2 rounded-md border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => handleDelete(confirmDoc.id)}
                  className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="w-full max-w-3xl h-full bg-white shadow-2xl rounded-l-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Previewing</p>
                  <p className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {previewDoc.title}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={previewDoc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#203972] hover:underline"
                  >
                    Open in new tab
                  </a>
                  <button
                    onClick={() => setPreviewDocId(null)}
                    className="px-3 py-1.5 rounded-md bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-gray-50 p-4 overflow-auto">
                <div className="bg-white rounded-xl border border-gray-200 p-3 min-h-[400px] flex items-center justify-center">
                  {renderPreview(previewDoc)}
                </div>
                <div className="mt-4 text-xs text-gray-600 space-y-1">
                  <p>Year: {previewDoc.year ?? "—"}</p>
                  <p>Description: {previewDoc.description || "—"}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
