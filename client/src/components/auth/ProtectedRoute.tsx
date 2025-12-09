import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("auth_token");
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  const payload = JSON.parse(atob(token.split(".")[1]));

  // Case 1: UNVERIFIED users may ONLY access /register
  if (!payload.verified) {
    if (location.pathname !== "/register") {
      return <Navigate to="/register" replace />;
    }
  }

  // Case 2: VERIFIED users should NOT access /register
  if (payload.verified && location.pathname === "/register") {
    return <Navigate to="/dashboard" replace />;
  }

  // Allowed route → render child
  return children;
}
