import React from "react";
import {Navbar} from "./Navbar";
import {Link} from "react-router";

/**
 * Layout principal de la aplicación Movu.
 * Envuelve las páginas internas con Navbar y estructura base.
 */
interface LayoutProps {
  children: React.ReactNode;
}

const LayoutMovu: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar />
      <main style={{ padding: "1rem", minHeight: "80vh" }}>{children}</main>
      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          background: "#111",
          color: "#aaa",
        }}
      >
        <p className="text-gray-300 text-sm text-center mt-6">
                    <Link
                      to="/SiteMapPage"
                      className="text-red-500 hover:underline font-medium"
                    >
                      Mapa del sitio
                    </Link>
                  </p>
        © 2025 Movu — Todos los derechos reservados
      </footer>
    </div>
  );
};

export default LayoutMovu;
