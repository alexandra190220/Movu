import React, { useState } from "react";
import { Navbar } from "../components/Navbar";

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Inicio de sesión exitoso ✅");
      // Aquí podrías usar navigate("/home");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col">
      {/* ✅ Navbar reutilizable con el logo */}
      <Navbar />

      {/* Contenido principal */}
      <div className="flex-grow flex justify-center items-center px-4">
        <div className="bg-[#3a3f45] p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Iniciar sesión</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Correo electrónico</label>
              <input
                type="email"
                required
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition disabled:opacity-70"
            >
              {loading ? "Cargando..." : "Ingresar"}
            </button>
          </form>

          <p className="text-gray-300 text-sm text-center mt-6">
            ¿No tienes cuenta?{" "}
            <a href="#" className="text-red-500 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
