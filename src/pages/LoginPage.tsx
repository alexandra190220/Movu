import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../Services/AuthService"; // 👈 importa tu servicio

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);
      alert(`✅ ${data.message || "Inicio de sesión exitoso"}`);
      navigate("/HomePage");
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center px-4">
        <div className="bg-[#3a3f45] p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Iniciar sesión</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

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
            <Link to="/RegisterPage" className="text-red-500 hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
