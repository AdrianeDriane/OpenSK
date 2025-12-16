import { Routes, Route } from "react-router-dom";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./components/registerBarangayPage/LoginPage";
import { RegisterBarangayPage } from "./pages/RegisterBarangayPage";
import AuthSuccess from "./components/auth/AuthSuccess";
import { ProtectedSKRoute } from "./components/auth/ProtectedSKRoute";
import { ProtectedAdminRoute } from "./components/auth/ProtectedAdminRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { VerificationOnlyRoute } from "./components/auth/VerificationOnlyRoute";
import { ThemeSetupPage } from "./components/theme/ThemeSetupPage";
import { BarangayPortalPage } from "./pages/portal/BarangayPortalPage";
import { PortalAnnouncementsPage } from "./pages/portal/PortalAnnouncementsPage";
import { PortalDocumentsPage } from "./pages/portal/PortalDocumentsPage";
import { SKDashboardPage } from "./pages/SKDashboardPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AnnouncementsPage } from "./pages/AnnouncementsPage";
import { SKCouncilProfilePage } from "./pages/SKCouncilProfilePage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { InquiriesPage } from "./pages/InquiriesPage";

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

      <Route
        path="/inquiries"
        element={
          <ProtectedSKRoute>
            <InquiriesPage />
          </ProtectedSKRoute>
        }
      />

      {/* Public Portal Page */}
      <Route path="/portal/:slug" element={<BarangayPortalPage />} />
      <Route
        path="/portal/:slug/announcements"
        element={<PortalAnnouncementsPage />}
      />
      <Route
        path="/portal/:slug/documents/:typeName"
        element={<PortalDocumentsPage />}
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Default route (change as needed) */}
      {/* <Route path="*" element={<RegisterBarangayPage />} /> */}
    </Routes>
  );
}

export default App;
