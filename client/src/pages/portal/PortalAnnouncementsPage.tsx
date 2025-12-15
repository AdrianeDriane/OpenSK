import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  ArrowLeft,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../api/axios";
import { PortalNavbar } from "../../components/portal/PortalNavbar";
import { PortalFooterNew } from "../../components/portal/PortalFooterNew";
import type { ThemeBySlugResponse } from "../../types/theme";

interface Announcement {
  id: number;
  title: string;
  description: string;
  tag: string;
  createdAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const PortalAnnouncementsPage = () => {
  const { slug } = useParams();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [barangayName, setBarangayName] = useState<string>("");

  useEffect(() => {
    if (!slug) return;

    // Fetch barangay name for navbar; fall back to slug if unavailable
    api
      .get<ThemeBySlugResponse>(`/themes/slug/${slug}`)
      .then((res) => {
        setBarangayName(res.data.barangayName ?? slug);
      })
      .catch(() => {
        setBarangayName(slug);
      });
  }, [slug]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get(
          `/announcements/public/${slug}?page=${pagination.page}&limit=${pagination.limit}`
        );
        setAnnouncements(response.data.announcements);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, [slug, pagination.page]);

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
        <div className="mx-auto max-w-7xl">
          {/* Back Button */}
          <Link
            to={`/portal/${slug}`}
            className="mb-6 inline-flex items-center text-sm font-medium hover:underline"
            style={{
              color: "var(--color-accent)",
              fontFamily: "var(--font-body)",
            }}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Portal
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              All Announcements
            </h1>
            <p
              className="mt-2 text-gray-600"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Stay updated with the latest news and events
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2
                className="h-10 w-10 animate-spin"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && announcements.length === 0 && (
            <div className="rounded-lg bg-gray-50 p-12 text-center">
              <p
                className="text-lg text-gray-600"
                style={{ fontFamily: "var(--font-body)" }}
              >
                No announcements available at this time.
              </p>
            </div>
          )}

          {/* Announcements Grid */}
          {!isLoading && !error && announcements.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {announcements.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                  >
                    <div className="mb-4">
                      <span
                        className="rounded-md px-2 py-1 text-xs font-bold"
                        style={{
                          backgroundColor: "#f3f4f6",
                          color: "#4b5563",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>

                    <h3
                      className="mb-3 line-clamp-2 text-lg font-bold text-gray-900"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="mb-6 flex-1 text-sm text-gray-600"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.description}
                    </p>

                    <div
                      className="mt-auto flex items-center border-t border-gray-50 pt-4 text-xs text-gray-500"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <Calendar className="mr-1.5 h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <ChevronLeft className="h-5 w-5" />
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
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <PortalFooterNew barangayName={barangayName || slug || "Barangay"} />
    </div>
  );
};
