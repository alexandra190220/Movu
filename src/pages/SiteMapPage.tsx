/**
 * @file SiteMapPage.tsx
 * @description Displays a sitemap with quick navigation links to key sections of the MOVU platform. 
 * Users can access major routes such as Home, About, Login, Register, and Password Reset. 
 * Includes a return button to the home page and a footer.
 * 
 * @component
 * @example
 * return <SiteMapPage />;
 * 
 * @returns {JSX.Element} The rendered sitemap page component.
 * 
 * @accessibility
 * WCAG 2.1 Guideline 2.4.4 - Link Purpose (In Context): 
 * Each link text clearly describes its destination (e.g., “Inicio”, “Iniciar Sesión”), 
 * helping users and assistive technologies understand where each link leads.
 */

import React from "react";
import { Link } from "react-router-dom";

const SiteMapPage: React.FC = () => {
  const pages = [
    { name: "Inicio", path: "/" },
    { name: "Acerca de", path: "/AboutPage" },
    { name: "Iniciar Sesión", path: "/LoginPage" },
    { name: "Registrarse", path: "/RegisterPage" },
    { name: "Restablecer Contraseña", path: "/ConfirmResetPage" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2c2f33] px-6 py-12">
      <div className="bg-[#3a3d42] shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          🗺️ Mapa del Sitio
        </h1>

        <p className="text-gray-300 text-center mb-6">
          Accede fácilmente a las secciones principales de MOVU:
        </p>

        <ul className="space-y-3 text-center">
          {pages.map((page) => (
            <li key={page.path}>
              <Link
                to={page.path}
                className="block text-lg text-gray-100 hover:text-red-400 hover:underline transition duration-200"
              >
                {page.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-block w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Volver al inicio
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} MOVU — Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default SiteMapPage;
