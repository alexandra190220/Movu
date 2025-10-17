import { BrowserRouter, Routes, Route } from "react-router";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { LoginPage } from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import LayoutMovu from "../components/Layout";
import ConfirmResetPage from "../pages/ConfirmResetPage";
import SiteMapPage from "../pages/SiteMapPage";


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
        <Route path="/confirmResetPage" element={<ConfirmResetPage />} />

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
