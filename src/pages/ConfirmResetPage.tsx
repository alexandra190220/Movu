// src/pages/RecoverPasswordPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../Services/AuthService";
import { Navbar } from "../components/Navbar";
import { Loader2 } from "lucide-react"; // 👈 icono de carga

const RecoverPasswordPage: React.FC = () => {
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
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsError(false);
        setMessage(
          data.message ||
            "Si el correo existe, enviamos un enlace para restablecer tu contraseña."
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
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center px-4 py-24">
        <div className="bg-[#3a3f45] p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Recuperar Contraseña
          </h2>

          <p className="text-gray-300 text-sm mb-6 text-center leading-relaxed">
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {message && (
              <p
                className={`text-sm text-center ${
                  isError ? "text-red-400" : "text-green-400"
                }`}
              >
                {message}
              </p>
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
                  Enviando enlace...
                </>
              ) : (
                "Enviar Enlace"
              )}
            </button>
          </form>

          <button
            onClick={() => navigate("/LoginPage")}
            className="mt-6 text-red-400 hover:underline text-sm w-full text-center"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
