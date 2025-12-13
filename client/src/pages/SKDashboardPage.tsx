import { motion } from "framer-motion";
import {
  Megaphone,
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import { DashboardHeader } from "../components/skDashboardPage/DashboardHeader";
import { DashboardCard } from "../components/skDashboardPage/DashboardCard";
import { Footer } from "../components/landingPage/Footer";
export function SKDashboardPage() {
  const stats = [
    {
      label: "Pending Inquiries",
      value: "5",
      icon: MessageSquare,
      color: "text-[#db1d34]",
      bg: "bg-red-50",
    },
    {
      label: "Active Projects",
      value: "8",
      icon: Briefcase,
      color: "text-[#203972]",
      bg: "bg-blue-50",
    },
    {
      label: "Documents Uploaded",
      value: "124",
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <DashboardHeader />

      <main className="grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
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
            }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-[#203972] font-serif mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-600">
              Manage your barangay's transparency portal and engagement
              activities.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
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
                  delay: index * 0.1,
                }}
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

          {/* Main Navigation Grid */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[#203972]" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Upload Announcements"
                description="Post new updates, events, and public notices to your barangay portal."
                icon={Megaphone}
                href="/announcements"
                delay={0.1}
              />
              <DashboardCard
                title="Upload Documents"
                description="Manage ABYIP, CBYDP, Resolutions, Ordinances, and Accomplishment Reports."
                icon={FileText}
                href="/documents"
                delay={0.2}
              />
              <DashboardCard
                title="Manage Projects"
                description="Update status of ongoing projects and add new initiatives."
                icon={Briefcase}
                href="/projects"
                delay={0.3}
              />
              <DashboardCard
                title="SK Council Profile"
                description="Update council member information, roles, and contact details."
                icon={Users}
                href="/council"
                delay={0.4}
              />
              <DashboardCard
                title="Answer Inquiries"
                description="Respond to questions and concerns submitted by your constituents."
                icon={MessageSquare}
                href="/inquiries"
                variant="accent"
                delay={0.5}
              />
              <DashboardCard
                title="Activity Logs"
                description="View history of uploads, edits, and system activities."
                icon={Clock}
                href="/logs"
                variant="secondary"
                delay={0.6}
              />
            </div>
          </div>

          {/* Recent Activity / Alerts (Optional Context) */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              delay: 0.7,
            }}
            className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex items-start"
          >
            <AlertCircle className="w-6 h-6 text-[#203972] mr-4 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-[#203972] mb-1">
                System Notice
              </h3>
              <p className="text-sm text-blue-800">
                Please ensure all SALN documents for the current fiscal year are
                uploaded before the end of the month to maintain compliance
                rating.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
