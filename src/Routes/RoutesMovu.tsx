import { BrowserRouter, Routes, Route } from "react-router";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { LoginPage } from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import LayoutMovu from "../components/Layout";
import ResetPage from "../pages/ResetPage";
import SiteMapPage from "../pages/SiteMapPage";
import { DashboardPage } from "../pages/DashboardPage";
import ConfirResetPage from "../pages/ConfirResetPage";



/**
 * Define las rutas principales de la aplicación Movu.
 * Incluye páginas públicas (login y registro) y páginas internas con layout.
 */
const RoutesMovu = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 Rutas sin layout (páginas públicas) */}
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/resetPage" element={<ResetPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/confirResetPage" element={<ConfirResetPage />} />

        {/* 🔒 Rutas con layout (navbar y footer incluidos) */}
        <Route
          path="/*"
          element={
            <LayoutMovu>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/aboutPage" element={<AboutPage />} />
                <Route path="/SiteMapPage" element={<SiteMapPage />} />
              </Routes>
            </LayoutMovu>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesMovu;
