import api from "./axios";

/**
 * Response type for theme status check
 */
export interface ThemeStatusResponse {
  hasTheme: boolean;
  isDefaultTheme: boolean;
  barangayId: number;
}

/**
 * Check theme status for an SK Official user
 * @param userId - The ID of the SK Official user
 * @returns Theme status information
 * @throws Error if the request fails or user is not authorized
 */
export const checkThemeStatus = async (
  userId: number
): Promise<ThemeStatusResponse> => {
  try {
    const response = await api.get<ThemeStatusResponse>(
      `/themes/user/${userId}/status`
    );
    return response.data;
  } catch (error: unknown) {
    // Handle specific error cases
    const err = error as {
      response?: { status?: number; data?: { message?: string } };
    };
    if (err.response) {
      const status = err.response.status;
      const message =
        err.response.data?.message || "Failed to check theme status";

      if (status === 404) {
        throw new Error("User not found");
      } else if (status === 403) {
        throw new Error(
          "Access denied. Only SK Officials can check theme status."
        );
      } else if (status === 400) {
        throw new Error(message);
      }
    }

    // Generic error
    throw new Error("Failed to check theme status. Please try again.");
  }
};
