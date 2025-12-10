import { Search } from "lucide-react";

interface PortalNavbarProps {
  barangayName: string;
}

export const PortalNavbar = ({ barangayName }: PortalNavbarProps) => {
  return (
    <header
      className="sticky top-0 z-50 border-b border-gray-100"
      style={{ backgroundColor: "white" }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div
            className="mr-3 flex h-8 w-8 items-center justify-center rounded-md"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <span
              className="font-serif text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              O
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="text-lg font-bold leading-none"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Barangay {barangayName}
            </span>
            <span
              className="text-xs font-medium uppercase tracking-wide text-gray-500"
              style={{ fontFamily: "var(--font-body)" }}
            >
              OFFICIAL SK PORTAL
            </span>
          </div>
        </div>

        <div className="hidden items-center space-x-1 rounded-full bg-gray-100 px-4 py-2 md:flex md:w-64">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full border-none bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="text-sm font-medium text-gray-600 transition hover:opacity-80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Documents
          </button>
          <button
            className="text-sm font-medium text-gray-600 transition hover:opacity-80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Projects
          </button>
          <button
            className="rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
            style={{
              backgroundColor: "var(--color-primary)",
              fontFamily: "var(--font-body)",
            }}
          >
            Submit Inquiry
          </button>
        </div>
      </div>
    </header>
  );
};
