// src/pages/RecoverPasswordPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../Services/AuthService"; // import nombrado que ya usas

const ConfirmResetPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!email.trim()) {
      setIsError(true);
      setMessage("Por favor ingresa un correo válido.");
      return;
    }

    setLoading(true);
    try {
      // <-- Ajusta la ruta si tu backend la tiene diferente.
      const res = await fetch(`${API_URL}/password/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        // Mensaje simple (sin librerías externas)
        setIsError(false);
        setMessage(
          data.message ||
            "Si el correo existe, enviamos un enlace para restablecer la contraseña."
        );
      } else {
        setIsError(true);
        setMessage(data.message || data.error || "Error al enviar el correo.");
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
    <div className="min-h-screen bg-[#2f3437] flex items-start justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Header / espacio gris superior como en tu modelo */}
        <div className="text-left text-gray-400 mb-4">recuperar contraseña</div>

        <div className="bg-[#3b4042] rounded-sm p-12 shadow-inner">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-white text-2xl font-medium mb-6">
              Recuperar Contraseña
            </h1>

            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Ingresa tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col items-center">
              <label className="self-start text-gray-200 text-sm mb-2">
                Ingresa tu Correo Electronico:
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-64 p-2 rounded text-black placeholder-gray-900 mb-4 outline-none border border-gray-300 bg-gray-100"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black font-semibold px-6 py-2 rounded-full shadow-md hover:bg-gray-200 transition duration-150"
              >
                {loading ? "Enviando..." : "Enviar Enlace"}
              </button>
            </form>

            {/* Mensaje simple debajo */}
            {message && (
              <p
                className={`mt-6 text-sm ${
                  isError ? "text-red-400" : "text-green-400"
                }`}
              >
                {message}
              </p>
            )}

            <button
              onClick={() => navigate("/loginPage")}
              className="mt-6 text-red-400 hover:underline text-sm"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmResetPage;
