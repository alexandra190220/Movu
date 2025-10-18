import { BrowserRouter, Routes, Route } from "react-router";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { LoginPage } from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import LayoutMovu from "../components/Layout";
import ResetPage from "../pages/ResetPage";
import SiteMapPage from "../pages/SiteMapPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ProfilePage } from "../pages/ProfilePage";
import { EditProfilePage } from "../pages/EditProfilePage";
import ConfirResetPage from "../pages/ConfirResetPage";

/**
 * Main routing configuration for the Movu application.
 * Includes both public pages (login, register, reset) and internal pages that use the main layout.
 *
 * @component
 * @returns {JSX.Element} The application's route structure with layout and nested routes.
 */
const RoutesMovu = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 Routes without layout (public pages) */}
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/resetPage" element={<ResetPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/confirResetPage" element={<ConfirResetPage />} />

        {/* 🔒 Routes with layout (navbar and footer included) */}
        <Route
          path="/*"
          element={
            <LayoutMovu>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/aboutPage" element={<AboutPage />} />
                <Route path="/SiteMapPage" element={<SiteMapPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/ProfilePage" element={<ProfilePage />} />
                <Route path="/EditProfilePage" element={<EditProfilePage />} />
              </Routes>
            </LayoutMovu>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesMovu;
