import { motion } from "framer-motion";
import {
  FileText,
  PieChart,
  ClipboardList,
  ScrollText,
  ArrowRight,
} from "lucide-react";

const documents = [
  {
    title: "SALN",
    description: "Statement of Assets, Liabilities, and Net Worth",
    icon: FileText,
  },
  {
    title: "ABYIP",
    description: "Annual Barangay Youth Investment Plan",
    icon: PieChart,
  },
  {
    title: "Projects & Programs",
    description: "Detailed reports on ongoing and completed initiatives",
    icon: ClipboardList,
  },
  {
    title: "Minutes & Agendas",
    description: "Official records of council meetings and decisions",
    icon: ScrollText,
  },
];

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function DocumentShowcase() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-100px",
          }}
          transition={{
            duration: 0.6,
          }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#203972] mb-4">
            Institutional Transparency
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            OpenSK provides a standardized, secure platform for publishing
            essential governance documents, ensuring accountability at every
            level.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: "-100px",
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {documents.map((doc, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -8,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
              className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group"
            >
              <motion.div
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
                className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#203972] transition-colors duration-300"
              >
                <doc.icon className="w-6 h-6 text-[#203972] group-hover:text-white transition-colors duration-300" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
                {doc.title}
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {doc.description}
              </p>
              <div className="flex items-center text-[#203972] text-sm font-medium group-hover:text-[#db1d34] transition-colors cursor-pointer">
                View Sample
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
