import { Routes, Route } from "react-router-dom";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./components/registerBarangayPage/LoginPage";
import { RegisterBarangayPage } from "./pages/RegisterBarangayPage";
import AuthSuccess from "./components/auth/AuthSuccess";
import { ProtectedSKRoute } from "./components/auth/ProtectedSKRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { VerificationOnlyRoute } from "./components/auth/VerificationOnlyRoute";
import { ThemeSetupPage } from "./components/theme/ThemeSetupPage";
import { BarangayPortalPage } from "./pages/portal/BarangayPortalPage";
import { SKDashboardPage } from "./pages/SKDashboardPage";
import { AnnouncementsPage } from "./pages/AnnouncementsPage";
import { SKCouncilProfilePage } from "./pages/SKCouncilProfilePage";
import { DocumentsPage } from "./pages/DocumentsPage";

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

      {/* Theme Customization - SK Officials must complete this before dashboard access */}
      <Route
        path="/theme_customization"
        element={
          <ProtectedSKRoute>
            <ThemeSetupPage />
          </ProtectedSKRoute>
        }
      />

      {/* Dashboard - Protected for SK Officials (requires theme customization) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedSKRoute>
            <SKDashboardPage />
          </ProtectedSKRoute>
        }
      />

      <Route
        path="/announcements"
        element={
          <ProtectedSKRoute>
            <AnnouncementsPage />
          </ProtectedSKRoute>
        }
      />

      <Route
        path="/council"
        element={
          <ProtectedSKRoute>
            <SKCouncilProfilePage />
          </ProtectedSKRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedSKRoute>
            <DocumentsPage />
          </ProtectedSKRoute>
        }
      />

      {/* Public Portal Page */}
      <Route path="/portal/:slug" element={<BarangayPortalPage />} />

      {/* Default route (change as needed) */}
      {/* <Route path="*" element={<RegisterBarangayPage />} /> */}
    </Routes>
  );
}

export default App;
