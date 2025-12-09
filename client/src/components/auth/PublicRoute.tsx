import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export function PublicRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("auth_token");

  // If no token → allow access to /login
  if (!token) return children;

  const payload = JSON.parse(atob(token.split(".")[1]));

  // If logged in but not verified → go to verification
  if (!payload.verified) return <Navigate to="/register" replace />;

  // If logged in & verified → go to dashboard
  return <Navigate to="/dashboard" replace />;
}
