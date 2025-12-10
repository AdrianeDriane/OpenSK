import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  FileText,
  PieChart,
  ClipboardList,
  ScrollText,
} from "lucide-react";
import api from "../../api/axios";
import type { ThemeBySlugResponse } from "../../types/theme";
import { applyTheme } from "../../theme/applyTheme";
import { PortalNavbar } from "../../components/portal/PortalNavbar";
import { AnnouncementGrid } from "../../components/portal/AnnouncementGrid";
import { DocumentCard } from "../../components/portal/DocumentCard";
import { ProjectCard } from "../../components/portal/ProjectCard";
import { CouncilGrid } from "../../components/portal/CouncilGrid";
import { InquiryForm } from "../../components/portal/InquiryForm";
import { PortalFooterNew } from "../../components/portal/PortalFooterNew";

export const BarangayPortalPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState<ThemeBySlugResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const barangayName = data?.barangayName || "[Barangay Name]";

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
      <PortalNavbar barangayName={barangayName} />

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
                  className="px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "white",
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  View Latest Reports
                </button>
                <button
                  className="px-6 py-3 rounded-lg font-medium transition-all hover:bg-white/10"
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "white",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Contact Council
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-16">
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
              Document Services
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <DocumentCard
                icon={FileText}
                title="Barangay Clearance"
                description="Official clearance for various purposes"
                count={24}
              />
              <DocumentCard
                icon={PieChart}
                title="Budget Reports"
                description="Transparency reports and allocations"
                count={12}
              />
              <DocumentCard
                icon={ClipboardList}
                title="Ordinances"
                description="Local laws and regulations"
                count={18}
              />
              <DocumentCard
                icon={ScrollText}
                title="Certificates"
                description="Residency and other certifications"
                count={31}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16">
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
              Community Projects
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ProjectCard
                title="Youth Skills Training Program"
                description="Free vocational training for out-of-school youth ages 15-24"
                status="Ongoing"
                progress={65}
                location="Barangay Hall"
                date="Jan - Jun 2025"
                image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop"
              />
              <ProjectCard
                title="Community Garden Initiative"
                description="Urban farming project for sustainable food production"
                status="Completed"
                progress={100}
                location="Zone 3 Area"
                date="Completed Dec 2024"
                image="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop"
              />
              <ProjectCard
                title="Street Lighting Upgrade"
                description="LED lighting installation for safer streets at night"
                status="Planned"
                progress={0}
                location="Main Roads"
                date="Starting Feb 2025"
                image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
              />
            </div>
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
            <CouncilGrid barangayName={barangayName} />
          </motion.div>
        </div>
      </section>

      {/* Inquiry Section */}
      <section className="py-16">
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
