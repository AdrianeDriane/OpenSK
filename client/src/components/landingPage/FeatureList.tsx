import { motion } from "framer-motion";
import { Upload, Palette, Globe, MessageSquare } from "lucide-react";

const features = [
  {
    title: "Transparency Documents",
    description:
      "Easily upload and publish SALN, ABYIP, project reports, and meeting minutes in a standardized format.",
    icon: Upload,
  },
  {
    title: "Theme Customization",
    description:
      "Maintain brand identity by customizing your barangay's colors, fonts, and button styles within the official layout.",
    icon: Palette,
  },
  {
    title: "Public-Facing Portal",
    description:
      "A dedicated, accessible page for citizens to view documents, announcements, and local SK initiatives.",
    icon: Globe,
  },
  {
    title: "Inquiry System",
    description:
      "Direct channel for citizens to submit concerns or questions, with tools for officials to manage responses.",
    icon: MessageSquare,
  },
];

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function FeatureList() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              margin: "-100px",
            }}
            transition={{
              duration: 0.6,
            }}
            className="lg:col-span-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#203972] mb-6 leading-tight">
              Comprehensive Tools for Modern Governance
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              OpenSK equips Sangguniang Kabataan officials with a complete suite
              of digital tools designed to foster transparency, accountability,
              and youth engagement.
            </p>
            <div className="h-1 w-20 bg-[#db1d34]"></div>
          </motion.div>

          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                margin: "-100px",
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start"
                >
                  <div className="shrink-0">
                    <motion.div
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                      }}
                      className="flex items-center justify-center h-12 w-12 rounded-md bg-[#203972] text-white"
                    >
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </motion.div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 font-serif mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
