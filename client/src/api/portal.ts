import api from "./axios";

export interface PortalDocument {
  id: number;
  title: string;
  description: string | null;
  year: number | null;
  fileUrl: string;
  createdAt: string;
  type: {
    id: number;
    name: string;
  };
}

export interface GetAllDocumentsResponse {
  barangaySlug: string;
  documents: PortalDocument[];
}

/**
 * Fetches all documents for a barangay by its slug.
 * Used for the search functionality in the portal navbar.
 */
export const getAllDocumentsBySlug = async (
  slug: string
): Promise<GetAllDocumentsResponse> => {
  const response = await api.get<GetAllDocumentsResponse>(
    `/documents/public/${slug}/all`
  );
  return response.data;
};
