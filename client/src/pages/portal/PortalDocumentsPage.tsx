import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Eye,
  X,
} from "lucide-react";
import api from "../../api/axios";
import { PortalNavbar } from "../../components/portal/PortalNavbar";
import { PortalFooterNew } from "../../components/portal/PortalFooterNew";
import type { ThemeBySlugResponse } from "../../types/theme";

interface PortalDocument {
  id: number;
  title: string;
  description: string | null;
  year: number | null;
  fileUrl: string;
  createdAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const PortalDocumentsPage = () => {
  const { slug, typeName } = useParams();
  const decodedType = useMemo(
    () => decodeURIComponent(typeName || "").trim(),
    [typeName]
  );

  const [documents, setDocuments] = useState<PortalDocument[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [barangayName, setBarangayName] = useState<string>("");
  const [documentTypeName, setDocumentTypeName] = useState<string>(decodedType);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  // Fetch barangay name for navbar
  useEffect(() => {
    if (!slug) return;

    api
      .get<ThemeBySlugResponse>(`/themes/slug/${slug}`)
      .then((res) => {
        setBarangayName(res.data.barangayName ?? slug);
      })
      .catch(() => setBarangayName(slug ?? "Barangay"));
  }, [slug]);

  // Fetch documents for the selected type
  useEffect(() => {
    if (!slug || !decodedType) return;

    setIsLoading(true);
    setError(null);

    api
      .get(
        `/documents/public/${slug}/${encodeURIComponent(decodedType)}?page=${
          pagination.page
        }&limit=${pagination.limit}`
      )
      .then((res) => {
        setDocuments(res.data.documents as PortalDocument[]);
        setPagination(res.data.pagination as PaginationData);
        setDocumentTypeName(res.data.documentType || decodedType);
      })
      .catch(() => setError("Failed to load documents"))
      .finally(() => setIsLoading(false));
  }, [slug, decodedType, pagination.page, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        fontFamily: "var(--font-body)",
        backgroundColor: "var(--color-background)",
      }}
    >
      <PortalNavbar barangayName={barangayName || slug || "Barangay"} />

      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            to={`/portal/${slug}`}
            className="mb-6 inline-flex items-center text-sm font-medium hover:underline"
            style={{
              color: "var(--color-accent)",
              fontFamily: "var(--font-body)",
            }}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Portal
          </Link>

          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1
                className="text-3xl font-bold"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {documentTypeName || "Documents"}
              </h1>
              <p
                className="mt-1 text-sm text-gray-600"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Showing documents for {barangayName || slug}
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2
                className="h-10 w-10 animate-spin"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
          )}

          {error && !isLoading && (
            <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
              {error}
            </div>
          )}

          {!isLoading && !error && documents.length === 0 && (
            <div className="rounded-lg bg-gray-50 p-12 text-center">
              <p
                className="text-lg text-gray-600"
                style={{ fontFamily: "var(--font-body)" }}
              >
                No documents available for this category yet.
              </p>
            </div>
          )}

          {!isLoading && !error && documents.length > 0 && (
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-md"
                        style={{ backgroundColor: "rgba(32,57,114,0.08)" }}
                      >
                        <FileText
                          className="h-5 w-5"
                          style={{ color: "var(--color-primary)" }}
                        />
                      </div>
                      <div>
                        <h3
                          className="text-lg font-semibold text-gray-900"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {doc.title}
                        </h3>
                        <p
                          className="text-sm text-gray-600"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {doc.description || "No description provided."}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          {doc.year ? (
                            <span className="rounded-full bg-gray-100 px-2 py-1">
                              Year: {doc.year}
                            </span>
                          ) : null}
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(doc.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <ExternalLink className="mr-1.5 h-4 w-4" />
                        View / Download
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(doc.fileUrl);
                          setPreviewTitle(doc.title);
                        }}
                        className="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <Eye className="mr-1.5 h-4 w-4" />
                        Preview
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {previewUrl && (
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p
                    className="text-xs uppercase tracking-wide text-gray-500"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Preview
                  </p>
                  <h3
                    className="text-lg font-semibold text-gray-900"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {previewTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label="Close preview"
                  onClick={() => {
                    setPreviewUrl(null);
                    setPreviewTitle("");
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                <iframe
                  title={previewTitle || "Document preview"}
                  src={previewUrl}
                  className="h-full w-full"
                />
              </div>
            </div>
          )}

          {!isLoading && !error && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                ‹
              </button>
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                    pagination.page === pageNum
                      ? "font-bold text-white"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                  style={{
                    backgroundColor:
                      pagination.page === pageNum
                        ? "var(--color-primary)"
                        : undefined,
                    borderColor:
                      pagination.page === pageNum
                        ? "var(--color-primary)"
                        : undefined,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </main>

      <PortalFooterNew barangayName={barangayName || slug || "Barangay"} />
    </div>
  );
};
