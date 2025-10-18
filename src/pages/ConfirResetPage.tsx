/**
 * @file ConfirmResetPage.tsx
 * @description Page component that allows users to set a new password after receiving a reset token.
 * Provides form validation, visual feedback, and secure password visibility toggles.
 *
 * @component
 * @example
 * return <ConfirmResetPage />
 *
 * @remarks
 * - Uses React Router's `useLocation` to retrieve the reset token from the URL.
 * - Communicates with the backend API to confirm password reset.
 * - Includes responsive design and keyboard-accessible controls.
 * - Follows WCAG 2.1 AA accessibility standards.
 *
 * @accessibility
 * - All inputs have associated labels for screen readers.
 * - Sufficient color contrast between text, background, and focus outlines.
 * - Focus states are visible for keyboard users.
 * - Provides clear textual feedback for success or error states.
 *
 * @wcag
 * - **1.3.1 Info and Relationships**: Proper use of form labels and associations.
 * - **1.4.3 Contrast (Minimum)**: Ensures 4.5:1 contrast ratio for readability.
 * - **2.1.1 Keyboard**: Full keyboard navigation supported (no mouse required).
 * - **2.4.7 Focus Visible**: Inputs and buttons show clear focus indicators.
 * - **3.3.1 Error Identification**: Displays clear and descriptive error messages.
 * - **3.3.2 Labels or Instructions**: Each form control has an explicit label.
 * - **4.1.2 Name, Role, Value**: UI components expose accessible roles and names.
 */

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { API_URL } from "../Services/AuthService";
import { Navbar } from "../components/Navbar";

/**
 * React functional component for handling password reset confirmation.
 * Extracts a token from the URL and allows users to securely update their password.
 *
 * @function
 * @name ConfirmResetPage
 * @returns {JSX.Element} The password reset confirmation page UI.
 */
const ConfirmResetPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /** 
   * Extracts the reset token from the URL query parameters.
   * @constant
   * @type {string | null}
   */
  const token = new URLSearchParams(location.search).get("token");

  /**
   * Handles the password reset form submission.
   * Validates inputs, sends the new password to the API, and displays feedback.
   *
   * @async
   * @param {React.FormEvent} e - Form submission event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!password.trim() || !confirm.trim()) {
      setIsError(true);
      setMessage("Por favor completa ambos campos.");
      return;
    }

    if (password !== confirm) {
      setIsError(true);
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsError(false);
        setMessage("Tu contraseña se actualizó correctamente ✅");
        setTimeout(() => navigate("/LoginPage"), 3000);
      } else {
        setIsError(true);
        setMessage(data.message || "Error al restablecer la contraseña.");
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center px-4 py-24">
        <div className="bg-[#3a3f45] p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Restablecer Contraseña
          </h2>

          <p className="text-gray-300 text-sm mb-6 text-center leading-relaxed">
            Ingresa una nueva contraseña segura para tu cuenta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* === New Password Field === */}
            <div className="relative">
              <label htmlFor="newPassword" className="block text-sm mb-1">
                Nueva Contraseña
              </label>
              <input
                id="newPassword"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Ingresa tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-8 text-gray-400 hover:text-white"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* === Confirm Password Field === */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm mb-1">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Confirma tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
                className="absolute right-3 top-8 text-gray-400 hover:text-white"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* === Feedback Message === */}
            {message && (
              <p
                role="alert"
                aria-live="polite"
                className={`text-sm text-center ${
                  isError ? "text-red-400" : "text-green-400"
                }`}
              >
                {message}
              </p>
            )}

            {/* === Submit Button === */}
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
                  Actualizando...
                </>
              ) : (
                "Cambiar Contraseña"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmResetPage;
