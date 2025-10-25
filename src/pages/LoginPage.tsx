import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../Services/AuthService";
import { Loader2, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

/**
 * LoginPage component that allows users to authenticate into the system.
 * It includes input validation, loading feedback, success/error messages,
 * and redirects to the dashboard after successful login.
 *
 * @component
 * @returns {JSX.Element} The rendered login page.
 */
export const LoginPage: React.FC = () => {
  /** User email input state */
  const [email, setEmail] = useState("");

  /** User password input state */
  const [password, setPassword] = useState("");

  /** Controls whether the password is visible */
  const [showPassword, setShowPassword] = useState(false);

  /** Controls the loading spinner state during login */
  const [loading, setLoading] = useState(false);

  /** Stores success or error messages to display to the user */
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  /** Navigation hook used to redirect users after login */
  const navigate = useNavigate();

  /**
   * Handles the login process, including authentication, error handling,
   * loading state, and redirect to the dashboard if successful.
   *
   * @async
   * @param {React.FormEvent} e - The form submit event.
   * @returns {Promise<void>}
   */
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

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);

      // Redirect to dashboard after 1 second
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      setMessage({
        text: err.message || "Error al iniciar sesión 😞",
        type: "error",
      });
      // Auto-dismiss error message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#2b2f33] text-white px-4 pt-20 pb-10 min-h-[80vh] flex justify-center items-center">
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

            {message?.type === "error" && (
              <div className="flex items-center gap-2 mt-3 text-sm font-medium text-red-400">
                <XCircle size={18} />
                {message.text}
              </div>
            )}
          </div>

          <p className="text-gray-300 text-sm text-center mt-2">
            <Link to="/ResetPage" className="text-red-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>

          {message?.type === "success" && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm font-medium text-green-400">
              <CheckCircle size={18} />
              {message.text}
            </div>
          )}

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
          <Link to="/RegisterPage" className="text-red-500 hover:underline font-medium">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};
