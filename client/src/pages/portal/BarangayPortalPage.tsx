import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";
import {
  Building2,
  FileText,
  PieChart,
  ClipboardList,
  ScrollText,
  NotebookPen,
  Library,
} from "lucide-react";
import api from "../../api/axios";
import type { ThemeBySlugResponse } from "../../types/theme";
import { applyTheme } from "../../theme/applyTheme";
import { PortalNavbar } from "../../components/portal/PortalNavbar";
import { AnnouncementGrid } from "../../components/portal/AnnouncementGrid";
import { DocumentCard } from "../../components/portal/DocumentCard";
import { CouncilGrid } from "../../components/portal/CouncilGrid";
import { InquiryForm } from "../../components/portal/InquiryForm";
import { PortalFooterNew } from "../../components/portal/PortalFooterNew";

export const BarangayPortalPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState<ThemeBySlugResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docSummary, setDocSummary] = useState<Record<string, number>>({});
  const [docLoading, setDocLoading] = useState(true);
  const [docError, setDocError] = useState<string | null>(null);
  const docScrollRef = useRef<HTMLDivElement | null>(null);

  const documentTypes = [
    {
      name: "ABYIP",
      description: "Annual Barangay Youth Investment Program",
      icon: NotebookPen,
    },
    {
      name: "CBYDP",
      description: "Comprehensive Barangay Youth Development Plan",
      icon: PieChart,
    },
    {
      name: "Resolutions",
      description: "Official SK and barangay resolutions",
      icon: FileText,
    },
    {
      name: "Ordinances",
      description: "Local ordinances and policies",
      icon: ClipboardList,
    },
    {
      name: "Accomplishment Reports",
      description: "Reports on completed programs",
      icon: ScrollText,
    },
    {
      name: "Minutes of the Meeting",
      description: "Documented minutes for transparency",
      icon: Library,
    },
  ];

  useEffect(() => {
    if (!slug) {
      setError("Barangay slug is missing.");
      setIsLoading(false);
      applyTheme(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    applyTheme(null);

    api
      .get<ThemeBySlugResponse>(`/themes/slug/${slug}`)
      .then((res) => {
        setData(res.data);
        applyTheme(res.data.theme ?? null);
      })
      .catch((err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message || "Failed to load barangay theme.";
        setError(message);
        applyTheme(null);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    setDocLoading(true);
    setDocError(null);

    api
      .get(`/documents/public/${slug}/types`)
      .then((res) => {
        const map: Record<string, number> = {};
        (res.data.types as { name: string; count: number }[]).forEach((t) => {
          map[t.name.toLowerCase()] = t.count;
        });
        setDocSummary(map);
      })
      .catch(() => setDocError("Failed to load documents"))
      .finally(() => setDocLoading(false));
  }, [slug]);

  const barangayName = data?.barangayName || "[Barangay Name]";

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          fontFamily: "var(--font-body)",
          backgroundColor: "var(--color-background)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
            style={{
              borderColor: "var(--color-primary)",
              borderTopColor: "transparent",
            }}
          />
          <p className="text-sm text-slate-600">Loading portal…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{
          fontFamily: "var(--font-body)",
          backgroundColor: "var(--color-background)",
        }}
      >
        <div className="max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <p className="text-base font-semibold text-red-700">
            Unable to load portal
          </p>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "var(--font-body)",
        backgroundColor: "var(--color-background)",
      }}
    >
      {/* Navbar */}
      <PortalNavbar
        barangayName={barangayName}
        slug={slug}
        onScrollToSection={scrollToSection}
      />

      {/* Hero Section */}
      <section
        className="relative text-white py-20 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Building2 className="absolute -right-20 -bottom-20 w-96 h-96" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4 border"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  fontFamily: "var(--font-body)",
                }}
              >
                TRANSPARENCY & ENGAGEMENT
              </span>
              <h1
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Welcome to the Official Portal of <br />
                <span style={{ color: "var(--color-accent)" }}>
                  Sangguniang Kabataan {data?.barangayName}
                </span>
              </h1>
              <p
                className="text-xl mb-8 leading-relaxed max-w-2xl opacity-90"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Empowering the youth through transparent governance, active
                participation, and community-driven initiatives.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollToSection("announcements-section")}
                  className="px-6 py-3 font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "white",
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-body)",
                    borderRadius: "var(--btn-primary-radius)",
                  }}
                >
                  Latest Announcements
                </button>
                <button
                  onClick={() => scrollToSection("inquiry-section")}
                  className="px-6 py-3 font-medium transition-all hover:bg-white/10"
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "white",
                    fontFamily: "var(--font-body)",
                    borderRadius: "var(--btn-secondary-radius)",
                  }}
                >
                  Submit Inquiry
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section id="announcements-section" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <AnnouncementGrid />
          </motion.div>
        </div>
      </section>

      {/* Documents Section */}
      <section id="documents-section" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="mb-8 text-2xl font-bold text-slate-800"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Document Services
            </h2>
            {docError && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {docError}
              </div>
            )}

            <div className="relative">
              {/* Hide scrollbar for modern browsers */}
              <style>{`
                .doc-scroll::-webkit-scrollbar { display: none; }
                .doc-scroll { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>

              <button
                type="button"
                aria-label="Scroll documents left"
                onClick={() =>
                  docScrollRef.current?.scrollBy({
                    left: -320,
                    behavior: "smooth",
                  })
                }
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-sm transition hover:bg-gray-50"
              >
                <span className="sr-only">Scroll left</span>‹
              </button>

              <div
                className="overflow-x-auto pb-2 doc-scroll"
                ref={docScrollRef}
              >
                <div className="flex min-w-full flex-nowrap gap-4 whitespace-nowrap pr-10">
                  {documentTypes.map((docType, index) => {
                    const count = docSummary[docType.name.toLowerCase()] ?? 0;
                    return (
                      <DocumentCard
                        key={docType.name}
                        icon={docType.icon}
                        title={docType.name}
                        description={docType.description}
                        count={docLoading ? 0 : count}
                        delay={index * 0.05}
                        className="min-w-[240px] max-w-[260px] flex-shrink-0"
                        to={`/portal/${slug}/documents/${encodeURIComponent(
                          docType.name
                        )}`}
                      />
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                aria-label="Scroll documents right"
                onClick={() =>
                  docScrollRef.current?.scrollBy({
                    left: 320,
                    behavior: "smooth",
                  })
                }
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-sm transition hover:bg-gray-50"
              >
                <span className="sr-only">Scroll right</span>›
              </button>
            </div>

            {docLoading && (
              <p
                className="mt-4 text-sm text-gray-600"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Loading documents…
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* SK Council Section */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="mb-8 text-2xl font-bold text-slate-800"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              SK Council
            </h2>
            <CouncilGrid barangayName={barangayName} slug={slug} />
          </motion.div>
        </div>
      </section>

      {/* Inquiry Section */}
      <section id="inquiry-section" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="mb-8 text-2xl font-bold text-slate-800"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Submit an Inquiry
            </h2>
            <InquiryForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <PortalFooterNew barangayName={barangayName} />
    </div>
  );
};
