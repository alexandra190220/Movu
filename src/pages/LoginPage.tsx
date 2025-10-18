import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../Services/AuthService";
import { Loader2, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = await loginUser(email, password);
      setMessage({
        text: data.message || "Inicio de sesión exitoso 🎉",
        type: "success",
      });

      // Mostrar el mensaje de éxito un momento antes de redirigir
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      setMessage({
        text: err.message || "Error al iniciar sesión 😞",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center px-4 py-12 mt-24 sm:mt-16">
        <div className="bg-[#3a3f45] p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Iniciar Sesión</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Campo correo */}
            <div>
              <label className="block text-sm mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Campo contraseña */}
            <div>
              <label className="block text-sm mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2 pr-10 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Mensaje de error debajo de la contraseña */}
              {message?.type === "error" && (
                <div className="flex items-center gap-2 mt-3 p-2 rounded-lg text-sm font-medium bg-red-700/40 text-red-300 border border-red-600">
                  <XCircle size={18} />
                  {message.text}
                </div>
              )}
            </div>

            {/* Enlace de recuperación */}
            <p className="text-gray-300 text-sm text-center mt-2">
              <Link
                to="/ResetPage"
                className="text-red-500 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </p>

            {/* Mensaje de éxito arriba del botón */}
            {message?.type === "success" && (
              <div className="flex items-center gap-2 mt-4 mb-2 p-3 rounded-lg text-sm font-medium bg-green-700/40 text-green-300 border border-green-600">
                <CheckCircle size={18} />
                {message.text}
              </div>
            )}

            {/* Botón de login */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>

          {/* Enlace a registro */}
          <p className="text-gray-300 text-sm text-center mt-6">
            ¿No tienes cuenta?{" "}
            <Link
              to="/RegisterPage"
              className="text-red-500 hover:underline font-medium"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
