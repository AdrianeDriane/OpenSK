import { motion } from "framer-motion";
import { ShieldCheck, ChevronRight, Building2 } from "lucide-react";

interface HeroProps {
  onVisitClick?: () => void;
  onLearnMoreClick?: () => void;
}

export function Hero({ onVisitClick, onLearnMoreClick }: HeroProps) {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#203972]" />
        <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-[#203972]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Official Badge/Seal Element */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.5,
            }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-20 h-20 bg-[#203972] rounded-full flex items-center justify-center shadow-lg ring-4 ring-gray-100">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#db1d34] rounded-full p-1.5 ring-2 ring-white">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>
          </motion.div>

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
              duration: 0.5,
              delay: 0.1,
            }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#203972] text-sm font-medium mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#203972] mr-2"></span>
            Official Transparency Portal for Sangguniang Kabataan
          </motion.div>

          <motion.h1
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
              delay: 0.2,
            }}
            className="text-5xl md:text-6xl font-bold text-[#203972] tracking-tight mb-6 leading-tight"
          >
            OpenSK — Digital Transparency for{" "}
            <span className="italic">Every</span> SK Barangay
          </motion.h1>

          <motion.p
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
              delay: 0.3,
            }}
            className="mt-4 text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            A modern, customizable transparency and engagement portal made for
            Sangguniang Kabataan officials. Securely publish documents and
            interact with your constituents.
          </motion.p>

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
              duration: 0.5,
              delay: 0.4,
            }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={onVisitClick}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-[#db1d34] hover:bg-[#b9182b] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#db1d34] cursor-pointer"
            >
              Visit Barangay Portal
              <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={onLearnMoreClick}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#203972] text-base font-medium rounded-md text-[#203972] bg-transparent hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#203972] cursor-pointer"
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Registration Call to Action */}
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
              duration: 0.5,
              delay: 0.5,
            }}
            className="mt-12 pt-8 border-t border-gray-100"
          >
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              Register your barangay or SK official account to create your
              portal.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
