import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export function VerificationOnlyRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("auth_token");

  // Not logged in → cannot access /register
  if (!token) return <Navigate to="/login" replace />;

  const payload = JSON.parse(atob(token.split(".")[1]));

  // Verified users should NOT access /register
  if (payload.verified) return <Navigate to="/dashboard" replace />;

  // Only unverified users are allowed
  return children;
}
