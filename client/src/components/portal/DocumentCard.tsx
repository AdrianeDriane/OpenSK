import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface DocumentCardProps {
  title: string;
  description: string;
  count: number;
  icon: LucideIcon;
  delay?: number;
}

export const DocumentCard = ({
  title,
  description,
  count,
  icon: Icon,
  delay = 0,
}: DocumentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-300 group-hover:bg-[var(--color-primary)]"
          style={{ backgroundColor: "rgba(32,57,114,0.08)" }}
        >
          <Icon
            className="h-6 w-6 transition-colors duration-300 group-hover:text-white"
            style={{ color: "var(--color-primary)" }}
          />
        </div>
        <span
          className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {count} Files
        </span>
      </div>

      <h3
        className="mb-1 text-lg font-bold text-gray-900"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm text-gray-500"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {description}
      </p>

      <div
        className="mt-4 flex items-center text-sm font-medium transition-colors group-hover:text-[var(--color-accent)]"
        style={{
          color: "var(--color-primary)",
          fontFamily: "var(--font-body)",
        }}
      >
        View Documents
        <ArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
};
