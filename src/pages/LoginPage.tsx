import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { CheckCircle, XCircle, Eye, EyeOff, Loader2, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../Services/AuthService";

// Modal de confirmación reutilizable
const ConfirmModal: React.FC<{
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-[#2f3338] text-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm animate-fadeIn">
        <h2 className="text-xl font-semibold text-center mb-2">
          ¿Eliminar cuenta?
        </h2>
        <p className="text-gray-300 text-sm text-center mb-6">
          Esta acción no se puede deshacer. ¿Deseas continuar?
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md hover:shadow-red-900/40"
          >
            <CheckCircle size={16} />
            Sí, eliminar
          </button>

          <button
            onClick={onCancel}
            className="flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors shadow-md"
          >
            <X size={16} />
            Cancelar
          </button>
        </div>
      </div>

      {/* Animación suave */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out;
          }
        `}
      </style>
    </div>
  );
};

/**
 * LoginPage Component
 */
export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = await loginUser(email, password);
      setMessage({
        text: data.message || "Perfil actualizado correctamente ✅",
        type: "success",
      });

      // Desaparecer mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      setMessage({
        text: err.message || "Error al iniciar sesión 😞",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    setShowModal(false);
    setMessage({
      text: "Cuenta eliminada correctamente 🗑️",
      type: "success",
    });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center px-4 py-12 mt-24 sm:mt-16">
        <div className="bg-[#3a3f45] p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Iniciar Sesión</h2>

          <form onSubmit={handleLogin} className="space-y-5">
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

            <div>
              <label className="block text-sm mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 mt-4 text-sm font-medium transition-opacity ${
                  message.type === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle size={18} />
                ) : (
                  <XCircle size={18} />
                )}
                {message.text}
              </div>
            )}

            <p className="text-gray-300 text-sm text-center mt-2">
              <Link to="/ResetPage" className="text-red-500 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>

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

          <p className="text-gray-300 text-sm text-center mt-6">
            ¿No tienes cuenta?{" "}
            <Link
              to="/RegisterPage"
              className="text-red-500 hover:underline font-medium"
            >
              Regístrate aquí
            </Link>
          </p>

          <div className="text-center mt-6">
            <button
              onClick={handleDeleteAccount}
              className="text-gray-400 hover:text-red-500 text-sm underline"
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ConfirmModal
        show={showModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};
