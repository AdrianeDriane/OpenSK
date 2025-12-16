import { useEffect, useState, type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkThemeStatus } from "../../api/themeStatus";

interface ProtectedSKRouteProps {
  children: JSX.Element;
}

/**
 * Protected route component specifically for SK Officials (roleId = 1)
 *
 * Logic:
 * 1. If no token → redirect to login
 * 2. If user is Admin (roleId = 2) → redirect to /admin/dashboard
 * 3. If user is SK_Official (roleId = 1):
 *    - If not verified → redirect to /register
 *    - Check theme status via API
 *    - If hasTheme = false OR isDefaultTheme = true → redirect to /theme_customization
 *    - If hasTheme = true AND isDefaultTheme = false → allow access to /dashboard
 *
 * @param children - The child components to render if access is granted
 */
export function ProtectedSKRoute({ children }: ProtectedSKRouteProps) {
  const token = localStorage.getItem("auth_token");
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Parse token payload (only if token exists)
  let userId: number | null = null;
  let role: number | null = null;
  let verified: boolean = false;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id;
      role = payload.roleId;
      verified = payload.verified;
    } catch {
      // Invalid token - will be caught by !token check below
    }
  }

  // For SK Officials, check theme status
  useEffect(() => {
    // Skip checks for non-SK Officials or missing data
    if (!token || role !== 1 || !userId || !verified) {
      setIsLoading(false);
      return;
    }

    const checkTheme = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const status = await checkThemeStatus(userId);

        // Redirect to theme customization if:
        // 1. No theme exists (hasTheme = false), OR
        // 2. Theme exists but is still the default (isDefaultTheme = true)
        // BUT: Always allow access to /theme_customization page
        console.log(status);

        const needsCustomization = !status.hasTheme || status.isDefaultTheme;

        // Always allow access to /theme_customization page
        if (location.pathname === "/theme_customization") {
          setRedirectPath(null);
        } else if (needsCustomization) {
          // Force redirect to theme customization if theme is not customized
          setRedirectPath("/theme_customization");
        } else {
          setRedirectPath(null);
        }
      } catch (err) {
        console.error("Failed to check theme status:", err);
        setError(
          err instanceof Error ? err.message : "Failed to check theme status"
        );
        // On error, allow access but log the issue
        setRedirectPath(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkTheme();
  }, [userId, role, verified, token, location.pathname]);

  // === Early returns AFTER hooks ===

  // No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Admin users should not access SK Official routes
  if (role === 2) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Non-SK Official users (unknown role) → redirect to login
  if (role !== 1) {
    return <Navigate to="/login" replace />;
  }

  // SK Official not verified → redirect to register
  if (!verified) {
    return <Navigate to="/register" replace />;
  }

  // Loading state (only for SK Officials)
  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          fontFamily: "var(--font-body, system-ui)",
          backgroundColor: "var(--color-background, #f8fafc)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
            style={{
              borderColor: "var(--color-primary, #3b82f6)",
              borderTopColor: "transparent",
            }}
          />
          <p className="text-sm text-slate-600">
            Checking access permissions...
          </p>
        </div>
      </div>
    );
  }

  // Error state (show error but allow access)
  if (error) {
    console.error("Theme status check error:", error);
    // Continue rendering - don't block access on API errors
  }

  // Redirect logic for theme customization
  if (redirectPath && redirectPath !== location.pathname) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render children if all checks pass
  return children;
}
