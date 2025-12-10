import { Routes, Route } from "react-router-dom";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./components/registerBarangayPage/LoginPage";
import { RegisterBarangayPage } from "./pages/RegisterBarangayPage";
import AuthSuccess from "./components/auth/AuthSuccess";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { VerificationOnlyRoute } from "./components/auth/VerificationOnlyRoute";
import { ThemeSetupPage } from "./components/theme/ThemeSetupPage";
import { BarangayPortalPage } from "./pages/portal/BarangayPortalPage";

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Register Barangay */}

      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route path="/auth/success" element={<AuthSuccess />} />

      {/* Protected Routes */}
      <Route
        path="/register"
        element={
          <VerificationOnlyRoute>
            <RegisterBarangayPage />
          </VerificationOnlyRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ThemeSetupPage />
          </ProtectedRoute>
        }
      />

      <Route path="/portal/:slug" element={<BarangayPortalPage />} />

      {/* Default route (change as needed) */}
      {/* <Route path="*" element={<RegisterBarangayPage />} /> */}
    </Routes>
  );
}

export default App;
