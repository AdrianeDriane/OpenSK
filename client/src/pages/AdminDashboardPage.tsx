import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
  Shield,
} from "lucide-react";

export function AdminDashboardPage() {
  // Get user info from localStorage
  const authUser = localStorage.getItem("auth_user");
  const user = authUser ? JSON.parse(authUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.href = "/login";
  };

  const stats = [
    {
      label: "Pending Verifications",
      value: "12",
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Approved Barangays",
      value: "45",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Rejected Requests",
      value: "3",
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Total SK Officials",
      value: "156",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#203972] rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#203972]">
                  OpenSK Admin
                </h1>
                <p className="text-xs text-gray-500">Administration Panel</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-600">
                  {user.firstName} {user.lastName}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#db1d34] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-[#203972] font-serif mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage verification requests and oversee all registered barangays.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pending Verifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-xl font-bold text-[#203972] mb-4">
              Pending Verification Requests
            </h2>
            <p className="text-gray-500 text-center py-8">
              Verification management features coming soon...
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            OpenSK Admin Panel © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
