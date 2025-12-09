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

    // Redirect based on verification
    if (payload.verified) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/register";
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Authenticating...
    </div>
  );
}
