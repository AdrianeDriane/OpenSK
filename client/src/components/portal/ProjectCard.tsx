import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  location: string;
  date: string;
  status: "Ongoing" | "Completed" | "Planned";
  progress: number;
  image: string;
  delay?: number;
}

export const ProjectCard = ({
  title,
  description,
  location,
  date,
  status,
  progress,
  image,
  delay = 0,
}: ProjectCardProps) => {
  const statusColors: Record<string, string> = {
    Ongoing: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Planned: "bg-gray-100 text-gray-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full transform object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute right-4 top-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusColors[status]}`}
            style={{ fontFamily: "var(--font-body)" }}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3
          className="mb-2 text-xl font-bold"
          style={{
            color: "var(--color-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {title}
        </h3>
        <p
          className="mb-4 line-clamp-2 text-sm text-gray-600"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {description}
        </p>

        <div className="mt-auto space-y-4">
          <div
            className="flex items-center justify-between text-sm text-gray-500"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              {location}
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {date}
            </div>
          </div>

          <div>
            <div
              className="mb-1 flex justify-between text-xs font-medium"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span className="text-gray-500">Progress</span>
              <span style={{ color: "var(--color-primary)" }}>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: delay + 0.2 }}
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    status === "Completed" ? "#22c55e" : "var(--color-accent)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
