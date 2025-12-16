import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Building2,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

interface Barangay {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
}

interface BarangayListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BarangayListModal({ isOpen, onClose }: BarangayListModalProps) {
  const navigate = useNavigate();
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchBarangays();
    }
  }, [isOpen]);

  const fetchBarangays = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/barangays/portals");
      setBarangays(response.data.data);
    } catch {
      setError("Failed to load barangays. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBarangays = barangays.filter((barangay) =>
    barangay.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeBarangays = filteredBarangays.filter((b) => b.isActive);
  const inactiveBarangays = filteredBarangays.filter((b) => !b.isActive);

  const handleBarangayClick = (barangay: Barangay) => {
    if (barangay.isActive) {
      navigate(`/portal/${barangay.slug}`);
      onClose();
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-[#203972] to-[#1a2e5a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Visit Barangay Portal
                  </h2>
                  <p className="text-sm text-blue-200">
                    Select a barangay to view their SK portal
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search barangays..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#203972] focus:border-transparent"
                />
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-180px)] px-6 py-4">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#203972]" />
                  <span className="ml-3 text-gray-600">
                    Loading barangays...
                  </span>
                </div>
              )}

              {error && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={fetchBarangays}
                    className="px-4 py-2 bg-[#203972] text-white rounded-lg hover:bg-[#1a2e5a] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!isLoading && !error && filteredBarangays.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchQuery
                      ? "No barangays match your search"
                      : "No barangays available"}
                  </p>
                </div>
              )}

              {!isLoading && !error && filteredBarangays.length > 0 && (
                <div className="space-y-6">
                  {/* Active Portals */}
                  {activeBarangays.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Active Portals ({activeBarangays.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeBarangays.map((barangay) => (
                          <motion.button
                            key={barangay.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleBarangayClick(barangay)}
                            className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-left hover:bg-green-100 transition-colors cursor-pointer"
                          >
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                              <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {barangay.name}
                              </p>
                              <p className="text-sm text-green-600">
                                Portal Active
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inactive Portals */}
                  {inactiveBarangays.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-gray-400" />
                        Inactive Portals ({inactiveBarangays.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {inactiveBarangays.map((barangay) => (
                          <div
                            key={barangay.id}
                            className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60 cursor-not-allowed"
                          >
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shrink-0">
                              <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-500 truncate">
                                {barangay.name}
                              </p>
                              <p className="text-sm text-gray-400">
                                No verified SK official
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
