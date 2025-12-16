import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, FileText, Loader2, ExternalLink } from "lucide-react";
import { getAllDocumentsBySlug, type PortalDocument } from "../../api/portal";

interface DocumentSearchDropdownProps {
  slug: string;
}

const MAX_VISIBLE_DOCUMENTS = 4;

export const DocumentSearchDropdown = ({
  slug,
}: DocumentSearchDropdownProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState<PortalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch documents when dropdown opens for the first time
  const fetchDocuments = useCallback(async () => {
    if (hasFetched || !slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllDocumentsBySlug(slug);
      setDocuments(response.documents);
      setHasFetched(true);
    } catch {
      setError("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  }, [slug, hasFetched]);

  // Filter documents based on search query
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) {
      return documents.slice(0, MAX_VISIBLE_DOCUMENTS);
    }

    const query = searchQuery.toLowerCase().trim();
    return documents
      .filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.type.name.toLowerCase().includes(query)
      )
      .slice(0, MAX_VISIBLE_DOCUMENTS);
  }, [documents, searchQuery]);

  // Handle focus - open dropdown and fetch if needed
  const handleFocus = () => {
    setIsOpen(true);
    if (!hasFetched) {
      fetchDocuments();
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Open document in new tab
  const handleDocumentClick = (fileUrl: string) => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="flex items-center space-x-1 rounded-full bg-gray-100 px-4 py-2 md:w-64">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search documents..."
          className="w-full border-none bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          style={{ minWidth: "320px" }}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2
                className="h-6 w-6 animate-spin"
                style={{ color: "var(--color-primary)" }}
              />
              <span
                className="ml-2 text-sm text-gray-500"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Loading documents...
              </span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="px-4 py-6 text-center">
              <p
                className="text-sm text-red-500"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {error}
              </p>
              <button
                onClick={() => {
                  setHasFetched(false);
                  fetchDocuments();
                }}
                className="mt-2 text-sm font-medium hover:underline"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading &&
            !error &&
            hasFetched &&
            filteredDocuments.length === 0 && (
              <div className="px-4 py-6 text-center">
                <FileText className="mx-auto h-8 w-8 text-gray-300" />
                <p
                  className="mt-2 text-sm text-gray-500"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {searchQuery.trim()
                    ? "No documents match your search"
                    : "No documents available"}
                </p>
              </div>
            )}

          {/* Documents List */}
          {!isLoading && !error && filteredDocuments.length > 0 && (
            <ul className="max-h-80 overflow-y-auto py-2">
              {filteredDocuments.map((doc) => (
                <li key={doc.id}>
                  <button
                    onClick={() => handleDocumentClick(doc.fileUrl)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <div
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: "rgba(32, 57, 114, 0.08)" }}
                    >
                      <FileText
                        className="h-4 w-4"
                        style={{ color: "var(--color-primary)" }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-medium text-gray-900"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {doc.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {doc.type.name}
                        </span>
                        {doc.year && (
                          <span
                            className="text-xs text-gray-400"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {doc.year}
                          </span>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Footer hint */}
          {!isLoading && !error && documents.length > MAX_VISIBLE_DOCUMENTS && (
            <div
              className="border-t border-gray-100 px-4 py-2 text-center text-xs text-gray-400"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {searchQuery.trim()
                ? `Showing ${filteredDocuments.length} of ${documents.length} documents`
                : `Showing ${MAX_VISIBLE_DOCUMENTS} of ${documents.length} documents. Type to search more.`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
