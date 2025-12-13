import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  variant?: "primary" | "secondary" | "accent";
  delay?: number;
}
export function DashboardCard({
  title,
  description,
  icon: Icon,
  href,
  variant = "primary",
  delay = 0,
}: DashboardCardProps) {
  const getColors = () => {
    switch (variant) {
      case "accent":
        return "bg-red-50 text-[#db1d34] group-hover:bg-[#db1d34] group-hover:text-white";
      case "secondary":
        return "bg-blue-50 text-[#203972] group-hover:bg-[#203972] group-hover:text-white";
      default:
        return "bg-blue-50 text-[#203972] group-hover:bg-[#203972] group-hover:text-white";
    }
  };
  return (
    <motion.a
      href={href}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay,
      }}
      whileHover={{
        y: -5,
      }}
      className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${getColors()}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
          <ArrowRight
            className={`w-5 h-5 ${
              variant === "accent" ? "text-[#db1d34]" : "text-[#203972]"
            }`}
          />
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif group-hover:text-[#203972] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed grow">
        {description}
      </p>
    </motion.a>
  );
}
