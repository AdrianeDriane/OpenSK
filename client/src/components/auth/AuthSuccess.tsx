import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Save token
    localStorage.setItem("auth_token", token);

    // Decode the JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Store user info in localStorage
    localStorage.setItem("auth_user", JSON.stringify(payload));

    // Redirect based on role and verification
    // roleId 1 = SK Official, roleId 2 = Admin
    if (payload.roleId === 2) {
      // Admin users go directly to admin dashboard (admins are pre-verified)
      window.location.href = "/admin/dashboard";
    } else if (payload.verified) {
      // Verified SK Officials go to their dashboard
      window.location.href = "/dashboard";
    } else {
      // Unverified SK Officials go to registration
      window.location.href = "/register";
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Authenticating...
    </div>
  );
}
