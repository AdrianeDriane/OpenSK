import { motion } from "framer-motion";
import { Mail, Phone, Facebook } from "lucide-react";

interface CouncilGridProps {
  barangayName: string;
}

const councilMembers = [
  {
    name: "Hon. Juan Dela Cruz",
    role: "SK Chairperson",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    email: "juan.delacruz@sk.gov.ph",
  },
  {
    name: "Hon. Maria Santos",
    role: "SK Kagawad",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    email: "maria.santos@sk.gov.ph",
  },
  {
    name: "Hon. Pedro Reyes",
    role: "SK Kagawad",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    email: "pedro.reyes@sk.gov.ph",
  },
  {
    name: "Hon. Ana Lim",
    role: "SK Secretary",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    email: "ana.lim@sk.gov.ph",
  },
];

export const CouncilGrid = ({ barangayName }: CouncilGridProps) => {
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

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {councilMembers.map((member, index) => (
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
                src={member.image}
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
                {member.role}
              </p>

              <div className="flex justify-center space-x-3">
                <button
                  className="rounded-full bg-gray-50 p-2 text-gray-500 transition-colors hover:text-white"
                  style={{
                    ["--hover-bg" as string]: "var(--color-primary)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9fafb")
                  }
                >
                  <Mail className="h-4 w-4" />
                </button>
                <button
                  className="rounded-full bg-gray-50 p-2 text-gray-500 transition-colors hover:text-white"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9fafb")
                  }
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button
                  className="rounded-full bg-gray-50 p-2 text-gray-500 transition-colors hover:text-white"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9fafb")
                  }
                >
                  <Facebook className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
