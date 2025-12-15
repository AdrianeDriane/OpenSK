import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import api from "../../api/axios";

interface Announcement {
  id: number;
  title: string;
  description: string;
  tag: string;
  createdAt: string;
}

export const AnnouncementGrid = () => {
  const { slug } = useParams();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get(`/announcements/public/${slug}?limit=3`);
        setAnnouncements(response.data.announcements);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "var(--color-primary)" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 text-center">
        <p className="text-gray-600" style={{ fontFamily: "var(--font-body)" }}>
          No announcements available at this time.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="mb-2 flex items-center justify-between">
        <h2
          className="text-2xl font-bold"
          style={{
            color: "var(--color-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Latest Announcements
        </h2>
        <Link
          to={`/portal/${slug}/announcements`}
          className="flex items-center text-sm font-medium hover:underline"
          style={{
            color: "var(--color-accent)",
            fontFamily: "var(--font-body)",
          }}
        >
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {announcements.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
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
              className="mb-6 line-clamp-3 flex-1 text-sm text-gray-600"
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
    </div>
  );
};
