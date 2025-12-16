import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Hero } from "../components/landingPage/Hero";
import { DocumentShowcase } from "../components/landingPage/DocumentShowcase";
import { FeatureList } from "../components/landingPage/FeatureList";
import { Footer } from "../components/landingPage/Footer";
import { BarangayListModal } from "../components/landingPage/BarangayListModal";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

import SKLogo from "../assets/icons/sk_logo.png";

// Helper to check if user is logged in and get basic info
const getAuthInfo = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      firstName: payload.firstName || "",
      lastName: payload.lastName || "",
      roleId: payload.roleId,
    };
  } catch {
    return null;
  }
};

export function LandingPage() {
  const navigate = useNavigate();
  const [isBarangayModalOpen, setIsBarangayModalOpen] = useState(false);
  const authInfo = getAuthInfo();
  const isLoggedIn = authInfo !== null;

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.reload();
  };

  const handleDashboardClick = () => {
    if (authInfo?.roleId === 2) {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10.5 h-10.5 bg-[#203972] rounded-full flex items-center justify-center mr-2">
              <img src={SKLogo} className="w-10 h-10" alt="SK Logo" />
            </div>

            <span className="text-xl font-bold text-[#203972] font-serif tracking-tight">
              OpenSK
            </span>
          </div>
          <nav className="hidden md:flex space-x-8 absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => scrollToSection("hero-section")}
              className="text-gray-600 hover:text-[#203972] font-medium transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-600 hover:text-[#203972] font-medium transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => setIsBarangayModalOpen(true)}
              className="text-gray-600 hover:text-[#203972] font-medium transition-colors"
            >
              Visit
            </button>
          </nav>

          <div className="flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDashboardClick}
                  className="flex items-center gap-2 text-[#203972] font-medium hover:text-[#1a2e5a] transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>
                    {authInfo.firstName} {authInfo.lastName}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#db1d34] hover:bg-gray-100 rounded-md font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="text-[#203972] font-medium hover:text-[#1a2e5a] transition-colors cursor-pointer"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/register")}
                  className="bg-[#203972] text-white px-5 py-2 rounded-md font-medium hover:bg-[#1a2e5a] transition-colors shadow-sm cursor-pointer"
                >
                  Register Barangay
                </motion.button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="grow">
        <div id="hero-section">
          <Hero
            onVisitClick={() => setIsBarangayModalOpen(true)}
            onLearnMoreClick={() => scrollToSection("features")}
          />
        </div>
        <DocumentShowcase
          onViewSampleClick={() => setIsBarangayModalOpen(true)}
        />
        <FeatureList />

        {/* Call to Action Section */}
        <motion.section
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            margin: "-100px",
          }}
          transition={{
            duration: 0.6,
          }}
          className="bg-[#203972] py-20"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
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
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif"
            >
              Start Building Your SK Transparency Portal Today
            </motion.h2>
            <motion.p
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
              }}
              transition={{
                duration: 0.5,
                delay: 0.3,
              }}
              className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
            >
              Join hundreds of barangays committed to transparent governance.
              Customize your theme, upload documents, and engage your community.
            </motion.p>
            <motion.button
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
              }}
              transition={{
                duration: 0.5,
                delay: 0.4,
              }}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-md text-[#203972] bg-white hover:bg-gray-50 transition-colors shadow-lg cursor-pointer"
            >
              Create Official Account
            </motion.button>
          </div>
        </motion.section>
      </main>

      <Footer />

      {/* Barangay List Modal */}
      <BarangayListModal
        isOpen={isBarangayModalOpen}
        onClose={() => setIsBarangayModalOpen(false)}
      />
    </div>
  );
}
