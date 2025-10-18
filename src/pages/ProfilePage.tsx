// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteAccount, getUserData } from "../Services/AuthService";

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
            setLoading(false);
            return;
          }
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setLoading(false);
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
      alert("No se encontró el ID del usuario.");
      return;
    }

    try {
      const success = await deleteAccount(userId);
      if (success) {
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        alert("Tu cuenta ha sido eliminada correctamente.");
        window.location.href = "/LoginPage";
      } else {
        alert("No se pudo eliminar la cuenta. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      alert("Ocurrió un error al eliminar la cuenta.");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2B2E33] px-6">
      <div className="bg-[#3B3E43] shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">
          Perfil de Usuario
        </h1>

        <div className="space-y-4">
          <div>
            <p className="text-gray-300">Nombre completo</p>
            <p className="text-lg font-medium text-white">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : ""}
            </p>
          </div>

          <div>
            <p className="text-gray-300">Correo electrónico</p>
            <p className="text-lg font-medium text-white">{user.email ?? ""}</p>
          </div>

          <div>
            <p className="text-gray-300">Edad</p>
            <p className="text-lg font-medium text-white">
              {user.age ? `${user.age} años` : ""}
            </p>
          </div>

          {user.createdAt && (
            <div>
              <p className="text-gray-300">Cuenta creada</p>
              <p className="text-lg font-medium text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {user.updatedAt && (
            <div>
              <p className="text-gray-300">Última actualización</p>
              <p className="text-lg font-medium text-white">
                {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/EditProfilePage"
            className="w-full text-center bg-[#E50914] hover:bg-[#b0060f] text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Editar Perfil
          </Link>

          <button
            onClick={() => setShowConfirm(true)}
            className="w-full bg-[#E50914] hover:bg-[#b0060f] text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Eliminar Cuenta
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Volver
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#3B3E43] p-6 rounded-2xl shadow-lg w-80 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">
              ¿Eliminar cuenta?
            </h2>
            <p className="text-gray-300 mb-6 text-sm">
              Esta acción no se puede deshacer. ¿Deseas continuar?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDeleteAccount}
                className="bg-[#E50914] hover:bg-[#b0060f] text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
