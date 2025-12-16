import type { JSX } from "react";
import { Navigate } from "react-router-dom";

/**
 * Route for unverified SK Officials only (roleId = 1, verified = false)
 * Used for the /register page where SK Officials complete their verification
 *
 * Logic:
 * 1. No token → redirect to login
 * 2. Admin (roleId = 2) → redirect to /admin/dashboard
 * 3. Verified SK Official → redirect to /dashboard
 * 4. Unverified SK Official → allow access
 */
export function VerificationOnlyRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("auth_token");

  // Not logged in → cannot access /register
  if (!token) return <Navigate to="/login" replace />;

  const payload = JSON.parse(atob(token.split(".")[1]));

  // Admin users should not access SK Official verification
  if (payload.roleId === 2) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Verified SK Officials should NOT access /register
  if (payload.verified) return <Navigate to="/dashboard" replace />;

  // Only unverified SK Officials are allowed
  return children;
}
