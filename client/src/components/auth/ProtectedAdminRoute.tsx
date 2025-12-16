import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedAdminRouteProps {
  children: JSX.Element;
}

/**
 * Protected route component specifically for Admin users (roleId = 2)
 *
 * Logic:
 * 1. If no token → redirect to login
 * 2. If user is not Admin (roleId !== 2) → redirect based on their role:
 *    - SK Official (roleId = 1): redirect to /dashboard or /register
 * 3. If user is Admin → allow access
 */
export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const token = localStorage.getItem("auth_token");

  // No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Parse token - if invalid, we'll handle it outside try/catch
  let payload: { roleId?: number; verified?: boolean } | null = null;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch {
    // Invalid token - clear and redirect to login
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }

  // Handle invalid token after try/catch
  if (!payload) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is Admin (roleId = 2)
  if (payload.roleId !== 2) {
    // Not an admin - redirect based on their role
    if (payload.roleId === 1) {
      // SK Official
      if (payload.verified) {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/register" replace />;
      }
    }
    // Unknown role - send to login
    return <Navigate to="/login" replace />;
  }

  // User is Admin → allow access
  return children;
}
