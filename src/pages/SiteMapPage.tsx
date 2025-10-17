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
        {/* Título */}
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          🗺️ Mapa del Sitio
        </h1>

        <p className="text-gray-300 text-center mb-6">
          Accede fácilmente a las secciones principales de MOVU:
        </p>

        {/* Lista de enlaces */}
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

        {/* Botón de volver */}
        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-block w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Volver al inicio
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} MOVU — Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default SiteMapPage;
