import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteAccount,
  getUserData,
  updateUser,
} from "../Services/AuthService";
import { User, Edit, Trash2, X, CheckCircle, Save } from "lucide-react";

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
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User & { password?: string }>({});
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
            setFormData(normalized);
            localStorage.setItem("user", JSON.stringify(normalized));
            return;
          }
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setFormData(parsed);
          return;
        }

        setUser(null);
      } catch (err) {
        console.error("Error loading profile:", err);
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

  // 🔄 Desaparecer mensajes automáticamente después de 3 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDeleteAccount = async () => {
    if (!user) return;
    const userId = user._id ?? user.id;
    if (!userId) {
      setMessage({ text: "ID de usuario no encontrado.", type: "error" });
      return;
    }

    try {
      const success = await deleteAccount(userId);
      if (success) {
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        setMessage({
          text: "Tu cuenta ha sido eliminada correctamente.",
          type: "success",
        });
        setTimeout(() => navigate("/LoginPage"), 1200);
      } else {
        setMessage({
          text: "No se pudo eliminar la cuenta. Por favor, inténtalo de nuevo.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage({
        text: "Ocurrió un error al eliminar la cuenta.",
        type: "error",
      });
    } finally {
      setShowConfirm(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔍 Validación de contraseña (igual que en el registro)
  const validatePassword = (password: string): string | null => {
    const minLength = 8;
    const regexUpper = /[A-Z]/;
    const regexLower = /[a-z]/;
    const regexNumber = /[0-9]/;
    const regexSpecial = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength)
      return "La contraseña debe tener al menos 8 caracteres.";
    if (!regexUpper.test(password))
      return "Debe incluir al menos una letra mayúscula.";
    if (!regexLower.test(password))
      return "Debe incluir al menos una letra minúscula.";
    if (!regexNumber.test(password)) return "Debe incluir al menos un número.";
    if (!regexSpecial.test(password))
      return "Debe incluir al menos un carácter especial.";

    return null;
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    const userId = user._id ?? user.id;
    if (!userId) {
      setMessage({ text: "ID de usuario no encontrado.", type: "error" });
      return;
    }

    if (formData.password && formData.password.trim() !== "") {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setMessage({ text: passwordError, type: "error" });
        return;
      }
    }

    try {
      const updated = await updateUser(userId, formData);
      if (updated) {
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setMessage({
          text: "Perfil actualizado correctamente ✅",
          type: "success",
        });
        setIsEditing(false);
      } else {
        setMessage({ text: "Error al actualizar el perfil.", type: "error" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        text: "Ocurrió un error al guardar los cambios.",
        type: "error",
      });
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
        <p className="text-lg mb-4 text-white">
          Ningún usuario ha iniciado sesión.
        </p>
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
            <h1 className="text-3xl font-semibold text-center">
              Perfil del Usuario
            </h1>
          </div>

          {!isEditing ? (
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
          ) : (
            <div className="space-y-4">
              <input
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleEditChange}
                placeholder="Nombre"
                className="w-full bg-[#2B2E33] border border-gray-600 rounded-lg p-2 text-white focus:border-[#E50914]"
              />
              <input
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleEditChange}
                placeholder="Apellido"
                className="w-full bg-[#2B2E33] border border-gray-600 rounded-lg p-2 text-white focus:border-[#E50914]"
              />
              <input
                name="age"
                type="number"
                value={formData.age || ""}
                onChange={handleEditChange}
                placeholder="Edad"
                className="w-full bg-[#2B2E33] border border-gray-600 rounded-lg p-2 text-white focus:border-[#E50914]"
              />
              <input
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleEditChange}
                placeholder="Correo electrónico"
                className="w-full bg-[#2B2E33] border border-gray-600 rounded-lg p-2 text-white focus:border-[#E50914]"
              />
              <input
                name="password"
                type="password"
                value={formData.password || ""}
                onChange={handleEditChange}
                placeholder="Nueva contraseña (opcional)"
                className="w-full bg-[#2B2E33] border border-gray-600 rounded-lg p-2 text-white focus:border-[#E50914]"
              />
            </div>
          )}

          {message && (
            <div
              className={`flex items-center gap-2 mt-6 p-3 rounded-lg text-sm font-medium transition-opacity duration-500 ${
                message.type === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              <CheckCircle size={18} />
              {message.text}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#E50914] hover:bg-[#b0060f] py-2 rounded-lg font-semibold shadow-md transition-all"
                >
                  <Edit size={18} /> Editar perfil
                </button>

                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold shadow-md transition-all"
                >
                  <Trash2 size={18} /> Eliminar cuenta
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="w-full flex items-center justify-center gap-2 bg-[#E50914] hover:bg-[#b0060f] py-2 rounded-lg font-semibold shadow-md transition-all"
                >
                  <Save size={18} /> Guardar cambios
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold shadow-md transition-all"
                >
                  <X size={18} /> Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#3B3E43] p-5 rounded-xl shadow-xl w-72 text-center border border-gray-600">
            <h2 className="text-lg font-semibold mb-3 text-white">
              ¿Eliminar cuenta?
            </h2>
            <p className="text-gray-300 mb-4 text-sm">
              Esta acción no se puede deshacer. ¿Deseas continuar?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDeleteAccount}
                className="bg-[#E50914] hover:bg-[#b0060f] text-white font-semibold py-1.5 px-3 rounded-lg transition-all text-sm"
              >
                Sí
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-all text-sm"
              >
                X Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
