import { motion } from "framer-motion";
import { Pin, Calendar, ArrowRight } from "lucide-react";

const announcements = [
  {
    id: 1,
    title: "Barangay Assembly 2024: State of the Barangay Address",
    date: "Oct 15, 2024",
    excerpt:
      "Join us for the semi-annual Barangay Assembly where we will discuss the accomplishments of the past 6 months and future plans.",
    pinned: true,
    category: "Event",
  },
  {
    id: 2,
    title: "Free Medical and Dental Mission",
    date: "Oct 22, 2024",
    excerpt:
      "The Barangay Health Center will be conducting a free medical and dental mission for all residents. Registration starts at 7AM.",
    pinned: false,
    category: "Health",
  },
  {
    id: 3,
    title: "SK Basketball League Registration Extended",
    date: "Oct 25, 2024",
    excerpt:
      "Due to popular demand, we are extending the registration for the Inter-Purok Basketball League until the end of the month.",
    pinned: false,
    category: "Sports",
  },
];

export const AnnouncementGrid = () => {
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
        <a
          href="#"
          className="flex items-center text-sm font-medium hover:underline"
          style={{
            color: "var(--color-accent)",
            fontFamily: "var(--font-body)",
          }}
        >
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {announcements.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex flex-col rounded-xl border bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md ${
              item.pinned ? "ring-1 ring-blue-50" : "border-gray-100"
            }`}
            style={{
              borderColor: item.pinned ? "var(--color-primary)" : undefined,
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className="rounded-md px-2 py-1 text-xs font-bold"
                style={{
                  backgroundColor: item.pinned
                    ? "rgba(32,57,114,0.1)"
                    : "#f3f4f6",
                  color: item.pinned ? "var(--color-primary)" : "#4b5563",
                  fontFamily: "var(--font-body)",
                }}
              >
                {item.category}
              </span>
              {item.pinned && (
                <Pin
                  className="h-4 w-4 fill-current"
                  style={{ color: "var(--color-primary)" }}
                />
              )}
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
              {item.excerpt}
            </p>

            <div
              className="mt-auto flex items-center border-t border-gray-50 pt-4 text-xs text-gray-500"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Calendar className="mr-1.5 h-3 w-3" />
              {item.date}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
