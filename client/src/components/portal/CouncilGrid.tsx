import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Facebook, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

interface SKOfficial {
  id: number;
  name: string;
  role: string;
  email: string | null;
  contactNumber: string | null;
  facebookProfile: string | null;
  imageUrl: string | null;
}

interface CouncilGridProps {
  barangayName: string;
  slug?: string;
}

export const CouncilGrid = ({ barangayName, slug }: CouncilGridProps) => {
  const [officials, setOfficials] = useState<SKOfficial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    api
      .get(`/sk-officials/public/${slug}`)
      .then((res) => {
        setOfficials(res.data.officials as SKOfficial[]);
      })
      .catch(() => {
        setError("Failed to load SK council members");
        setOfficials([]);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  const displayOfficials = officials.length > 0 ? officials : []; // No fallback; just show empty or loading state

  return (
    <div className="space-y-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2
          className="mb-4 text-3xl font-bold"
          style={{
            color: "var(--color-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Meet Your SK Council
        </h2>
        <p className="text-gray-600" style={{ fontFamily: "var(--font-body)" }}>
          Dedicated youth leaders serving the community of Barangay{" "}
          {barangayName} with integrity and passion.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2
            className="h-10 w-10 animate-spin"
            style={{ color: "var(--color-primary)" }}
          />
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {!isLoading && !error && displayOfficials.length === 0 && (
        <div className="rounded-lg bg-gray-50 p-12 text-center">
          <p
            className="text-gray-600"
            style={{ fontFamily: "var(--font-body)" }}
          >
            No SK council members at the moment.
          </p>
        </div>
      )}

      {!isLoading && !error && displayOfficials.length > 0 && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {displayOfficials.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={
                    member.imageUrl ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                  }
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 text-center">
                <h3
                  className="mb-1 text-lg font-bold text-gray-900"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {member.name}
                </h3>
                <p
                  className="mb-4 text-sm font-medium"
                  style={{
                    color: "var(--color-accent)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {member.role === "SK_COUNCILOR"
                    ? "SK Councilor"
                    : member.role === "CHAIRMAN"
                    ? "SK Chairman"
                    : member.role === "TREASURER"
                    ? "SK Treasurer"
                    : member.role === "SECRETARY"
                    ? "SK Secretary"
                    : member.role}
                </p>

                <div className="flex justify-center space-x-3">
                  {member.email && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(member.email!);
                        toast.success("Email copied to clipboard!");
                      }}
                      className="cursor-pointer rounded-full bg-gray-50 p-2 text-gray-500 transition-colors hover:text-white"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-primary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                      title={member.email}
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  )}
                  {member.contactNumber && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(member.contactNumber!);
                        toast.success("Phone number copied to clipboard!");
                      }}
                      className="cursor-pointer rounded-full bg-gray-50 p-2 text-gray-500 transition-colors hover:text-white"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-primary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                      title={member.contactNumber}
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                  )}
                  {member.facebookProfile && (
                    <a
                      href={member.facebookProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-gray-50 p-2 text-gray-500 transition-colors hover:text-white"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-primary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                      title="Facebook Profile"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
