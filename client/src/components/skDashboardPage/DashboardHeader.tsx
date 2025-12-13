import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, User, Bell } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  userRole?: string;
  barangayName?: string;
}

export function DashboardHeader({
  userName = "Juan Dela Cruz",
  userRole = "SK Chairperson",
  barangayName = "Barangay Pari-an",
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setIsDropdownOpen(false);
    navigate("/");
  };
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#203972] rounded-md flex items-center justify-center mr-3">
            <span className="text-white font-serif font-bold text-lg">O</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#203972] leading-none font-serif">
              OpenSK
            </span>
            <span className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5">
              {barangayName}
            </span>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-6">
          <button className="relative text-gray-500 hover:text-[#203972] transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#db1d34] rounded-full border-2 border-white"></span>
          </button>

          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          <div
            className="flex items-center space-x-3 relative"
            ref={dropdownRef}
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900 leading-none">
                {userName}
              </span>
              <span className="text-xs text-gray-500 mt-1">{userRole}</span>
            </div>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 text-[#203972] hover:bg-gray-200 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Logout Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#db1d34] transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
