import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteAccount, getUserData } from "../Services/AuthService";
import { User, Edit, Trash2, X, CheckCircle } from "lucide-react";

interface User {
  id?: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const fetched = await getUserData(userId);
          if (fetched && mounted) {
            const normalized = {
              _id: fetched._id ?? fetched.id,
              firstName: fetched.firstName,
              lastName: fetched.lastName,
              age: fetched.age,
              email: fetched.email,
              createdAt: fetched.createdAt,
              updatedAt: fetched.updatedAt,
            };
            setUser(normalized);
            localStorage.setItem("user", JSON.stringify(normalized));
            return;
          }
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          return;
        }

        setUser(null);
      } catch (err) {
        console.error("Error cargando perfil:", err);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDeleteAccount = async () => {
    if (!user) return;
    const userId = user._id ?? user.id;
    if (!userId) {
      setMessage({ text: "No se encontró el ID del usuario.", type: "error" });
      return;
    }

    try {
      const success = await deleteAccount(userId);
      if (success) {
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        setMessage({ text: "Tu cuenta ha sido eliminada correctamente.", type: "success" });
        setTimeout(() => navigate("/LoginPage"), 1200);
      } else {
        setMessage({ text: "No se pudo eliminar la cuenta. Intenta nuevamente.", type: "error" });
      }
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      setMessage({ text: "Ocurrió un error al eliminar la cuenta.", type: "error" });
    } finally {
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#2B2E33] text-gray-300">
        <p className="text-lg">Cargando información del perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#2B2E33] text-gray-300">
        <p className="text-lg mb-4 text-white">No hay usuario logueado.</p>
        <Link
          to="/LoginPage"
          className="text-[#E50914] font-medium hover:underline"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#2B2E33] text-white">
      <div className="flex flex-col items-center justify-center flex-grow mt-24 sm:mt-20 px-6">
        <div className="bg-[#3B3E43] shadow-lg rounded-2xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#E50914]/20 p-4 rounded-full mb-3">
              <User size={48} className="text-[#E50914]" />
            </div>
            <h1 className="text-3xl font-semibold text-center">Perfil de Usuario</h1>
          </div>

          <div className="space-y-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Nombre completo</p>
              <p className="text-lg font-medium">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : ""}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Correo electrónico</p>
              <p className="text-lg font-medium">{user.email ?? ""}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Edad</p>
              <p className="text-lg font-medium">
                {user.age ? `${user.age} años` : ""}
              </p>
            </div>

            {user.createdAt && (
              <div>
                <p className="text-gray-400 text-sm">Cuenta creada</p>
                <p className="text-lg font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Mensaje de confirmación o error */}
          {message && (
            <div
              className={`flex items-center gap-2 mt-6 p-3 rounded-lg text-sm font-medium border ${
                message.type === "success"
                  ? "bg-green-700/40 text-green-300 border-green-600"
                  : "bg-red-700/40 text-red-300 border-red-600"
              }`}
            >
              <CheckCircle size={18} />
              {message.text}
            </div>
          )}

          {/* Botones */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/EditProfilePage"
              className="w-full flex items-center justify-center gap-2 bg-[#E50914] hover:bg-[#b0060f] py-2 rounded-lg font-semibold shadow-md transition-all"
            >
              <Edit size={18} /> Editar Perfil
            </Link>

            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#E50914] hover:bg-[#b0060f] py-2 rounded-lg font-semibold shadow-md transition-all"
            >
              <Trash2 size={18} /> Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#3B3E43] p-6 rounded-2xl shadow-lg w-80 text-center border border-gray-600">
            <h2 className="text-xl font-semibold mb-4 text-white">
              ¿Eliminar cuenta?
            </h2>
            <p className="text-gray-300 mb-6 text-sm">
              Esta acción no se puede deshacer. ¿Deseas continuar?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 bg-[#E50914] hover:bg-[#b0060f] text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                <CheckCircle size={18} /> Sí, eliminar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                <X size={18} /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
