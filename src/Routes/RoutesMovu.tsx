import { BrowserRouter, Routes, Route } from "react-router";
import {HomePage} from "../pages/HomePage";
import {AboutPage} from "../pages/AboutPage";
import {LoginPage} from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import LayoutMovu from "../components/Layout";

/**
 * Define las rutas principales de la aplicación Movu.
 * Incluye páginas públicas (login y registro) y páginas internas con layout.
 */
const RoutesMovu = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas sin layout (páginas públicas) */}
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />

        {/* Rutas con layout (navbar y footer incluidos) */}
        <Route
          path="/*"
          element={
            <LayoutMovu>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/AboutPage" element={<AboutPage />} />
                <Route path="/loginPage" element={<LoginPage />} />
                <Route path="/RegisterPage" element={<RegisterPage />} />
              </Routes>
            </LayoutMovu>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesMovu;
