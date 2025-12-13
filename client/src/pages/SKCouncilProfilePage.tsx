import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Loader2,
  Mail,
  Phone,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";
import { DashboardHeader } from "../components/skDashboardPage/DashboardHeader";
import { Footer } from "../components/landingPage/Footer";
import api from "../api/axios";
import toast from "react-hot-toast";

interface SKOfficial {
  id: number;
  name: string;
  role: string;
  email?: string | null;
  contactNumber?: string | null;
  facebookProfile?: string | null;
  imageUrl?: string | null;
}

const ROLE_OPTIONS = [
  { value: "SK_COUNCILOR", label: "SK Councilor" },
  { value: "CHAIRMAN", label: "Chairman" },
  { value: "TREASURER", label: "Treasurer" },
  { value: "SECRETARY", label: "Secretary" },
];

export function SKCouncilProfilePage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("SK_COUNCILOR");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [facebookProfile, setFacebookProfile] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [officials, setOfficials] = useState<SKOfficial[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const selectedRoleLabel = useMemo(
    () => ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role,
    [role]
  );

  useEffect(() => {
    fetchOfficials();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchOfficials = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/sk-officials");
      setOfficials(response.data.officials);
    } catch (error) {
      console.error("Error fetching SK officials:", error);
      toast.error("Failed to load officials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !role || !email || !contactNumber) {
      toast.error("Please fill out all required fields");
      return;
    }

    if (!imageFile) {
      toast.error("Please upload a profile image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("email", email);
    formData.append("contactNumber", contactNumber);
    formData.append("facebookProfile", facebookProfile);
    formData.append("image", imageFile);

    setIsSubmitting(true);

    try {
      await api.post("/sk-officials", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setName("");
      setRole("SK_COUNCILOR");
      setEmail("");
      setContactNumber("");
      setFacebookProfile("");
      setImageFile(null);
      setPreviewUrl(null);

      toast.success("SK official added");
      fetchOfficials();
    } catch (error) {
      console.error("Error adding SK official:", error);
      toast.error("Failed to add SK official");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (confirmDeleteId === null) return;
    try {
      await api.delete(`/sk-officials/${confirmDeleteId}`);
      setOfficials((prev) =>
        prev.filter((official) => official.id !== confirmDeleteId)
      );
      toast.success("SK official deleted");
    } catch (error) {
      console.error("Error deleting SK official:", error);
      toast.error("Failed to delete SK official");
    }
    setConfirmDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <DashboardHeader />

      <main className="grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#203972] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#203972] font-serif">
                  SK Council Profile
                </h1>
                <p className="text-gray-600">
                  Add and manage SK officials displayed on your barangay portal.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Add SK Official
              </h2>
              <span className="text-sm text-gray-500">{selectedRoleLabel}</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#203972] focus:border-transparent"
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#203972] focus:border-transparent"
                    required
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#203972] focus:border-transparent"
                    placeholder="official@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#203972] focus:border-transparent"
                    placeholder="09XX XXX XXXX"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook Profile
                  </label>
                  <input
                    type="url"
                    value={facebookProfile}
                    onChange={(e) => setFacebookProfile(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#203972] focus:border-transparent"
                    placeholder="https://facebook.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image *
                  </label>
                  <div className="flex items-center space-x-4">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-20 h-20 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400">
                        <UserPlus className="w-6 h-6" />
                      </div>
                    )}
                    <label className="px-4 py-2.5 bg-[#203972] text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-[#1a2d5c] transition-colors">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#203972] text-white font-semibold rounded-lg hover:bg-[#1a2d5c] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Add Official"
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Existing Councilors
              </h2>
              <span className="text-sm text-gray-500">
                {officials.length} total
              </span>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-[#203972] animate-spin" />
              </div>
            ) : officials.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Users className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No councilors added yet. Start by adding an SK official above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {officials.map((official, index) => (
                  <motion.div
                    key={official.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={
                          official.imageUrl ??
                          "https://via.placeholder.com/96x96?text=SK"
                        }
                        alt={official.name}
                        className="w-16 h-16 rounded-full object-cover border"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {official.name}
                        </h3>
                        <p className="text-sm text-[#203972] font-semibold">
                          {ROLE_OPTIONS.find(
                            (option) => option.value === official.role
                          )?.label ?? official.role}
                        </p>
                      </div>
                      <button
                        onClick={() => setConfirmDeleteId(official.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete official"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {official.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{official.email}</span>
                        </div>
                      )}
                      {official.contactNumber && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{official.contactNumber}</span>
                        </div>
                      )}
                      {official.facebookProfile && (
                        <a
                          href={official.facebookProfile}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center text-[#203972] hover:underline"
                        >
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Facebook Profile
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete SK Official?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This will permanently remove the official from the council list.
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
