import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("auth_token");

  if (!token) return <Navigate to="/login" replace />;

  const payload = JSON.parse(atob(token.split(".")[1]));

  // Unverified users can ONLY access /register
  if (!payload.verified && window.location.pathname !== "/register") {
    return <Navigate to="/register" replace />;
  }

  // Verified users should NEVER access /register
  if (payload.verified && window.location.pathname === "/register") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
