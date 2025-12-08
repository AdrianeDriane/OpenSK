import { Routes, Route } from "react-router-dom";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./components/registerBarangayPage/LoginPage";
import { RegisterBarangayPage } from "./pages/RegisterBarangayPage";

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Register Barangay */}
      <Route path="/register" element={<RegisterBarangayPage />} />

      {/* Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Default route (change as needed) */}
      {/* <Route path="*" element={<RegisterBarangayPage />} /> */}
    </Routes>
  );
}

export default App;

