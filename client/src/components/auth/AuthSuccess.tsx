import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      console.error("No token found in URL");
      window.location.href = "/login";
      return;
    }

    // Save token
    localStorage.setItem("auth_token", token);

    // Decode the JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Redirect based on 'verified'
    if (payload.verified === true) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/register";
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-700">
      Redirecting, please wait...
    </div>
  );
}
