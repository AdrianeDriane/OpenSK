import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Megaphone, Calendar, User, Loader2, ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/skDashboardPage/DashboardHeader";
import { Footer } from "../components/landingPage/Footer";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Announcement {
  id: number;
  title: string;
  description: string;
  tag: string;
  createdAt: string;
  creator: {
    firstName: string;
    lastName: string;
  };
}

const ANNOUNCEMENT_TAGS = [
  "Event",
  "Notice",
  "Alert",
  "Health",
  "Sports",
  "Education",
  "Environment",
  "Emergency",
  "Community",
  "Youth Program",
];

export function AnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // Fetch announcements
  const fetchAnnouncements = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/announcements?page=${page}&limit=10`);
      setAnnouncements(response.data.announcements);
      setTotalPages(response.data.pagination.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !tag) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/announcements", {
        title,
        description,
        tag,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setTag("");

      // Refresh announcements list
      fetchAnnouncements(1);
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to create announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      Event: "bg-purple-100 text-purple-800",
      Notice: "bg-blue-100 text-blue-800",
      Alert: "bg-red-100 text-red-800",
      Health: "bg-green-100 text-green-800",
      Sports: "bg-orange-100 text-orange-800",
      Education: "bg-indigo-100 text-indigo-800",
      Environment: "bg-teal-100 text-teal-800",
      Emergency: "bg-red-200 text-red-900",
      Community: "bg-yellow-100 text-yellow-800",
      "Youth Program": "bg-pink-100 text-pink-800",
    };
    return colors[tag] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <DashboardHeader />

      <main className="grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center mb-2">
              <ArrowLeft
                className="w-8 h-8 text-[#203972] mr-3 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              />
              <Megaphone className="w-8 h-8 text-[#203972] mr-3" />
              <h1 className="text-3xl font-bold text-[#203972] font-serif">
                Upload Announcements
              </h1>
            </div>
            <p className="text-gray-600">
              Create and manage announcements for your barangay constituents.
            </p>
          </motion.div>

          {/* Create Announcement Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-12"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Create New Announcement
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#203972] focus:border-transparent"
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#203972] focus:border-transparent resize-none"
                  placeholder="Enter announcement description"
                  required
                />
              </div>

              {/* Tag */}
              <div>
                <label
                  htmlFor="tag"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tag *
                </label>
                <select
                  id="tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#203972] focus:border-transparent"
                  required
                >
                  <option value="">Select a tag</option>
                  {ANNOUNCEMENT_TAGS.map((tagOption) => (
                    <option key={tagOption} value={tagOption}>
                      {tagOption}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#203972] text-white font-semibold rounded-lg hover:bg-[#1a2d5c] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Announcement"
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Announcements List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Existing Announcements
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-[#203972] animate-spin" />
              </div>
            ) : announcements.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No announcements yet. Create your first announcement above!
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 flex-1">
                          {announcement.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getTagColor(
                            announcement.tag
                          )}`}
                        >
                          {announcement.tag}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {announcement.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1.5" />
                          {formatDate(announcement.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1.5" />
                          {announcement.creator.firstName}{" "}
                          {announcement.creator.lastName}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                      onClick={() => fetchAnnouncements(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => fetchAnnouncements(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
