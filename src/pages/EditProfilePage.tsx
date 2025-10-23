import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserData, updateUser } from "../Services/AuthService";

interface User {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  age?: number;
  email: string;
}

export const EditProfilePage: React.FC = () => {
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    age: 0,
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("Debes iniciar sesión para editar tu perfil.");
          navigate("/loginpage");
          return;
        }

        const data = await getUserData(userId);
        if (data) {
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            age: data.age || 0,
            email: data.email || "",
          });
        }
      } catch (err) {
        console.error("Error al cargar los datos del usuario:", err);
        alert("No se pudieron cargar los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Usuario no encontrado.");

    try {
      setSaving(true);
      const updated = await updateUser(userId, formData);
      if (updated) {
        localStorage.setItem("user", JSON.stringify(updated));
        alert("Perfil actualizado correctamente.");
        navigate("/profilepage");
      } else {
        alert("No se pudo actualizar el perfil.");
      }
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      alert("Ocurrió un error al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#2B2E33] text-gray-300">
        <p className="text-lg">Cargando datos del usuario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2B2E33] px-6">
      <div className="bg-[#3B3E43] shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">
          Editar perfil
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-gray-300 mb-1">
              Nombre
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-[#2B2E33] text-white
                 border border-gray-600
                 focus:outline-none focus:border-[#E50914]
                 hover:border-[#E50914] transition"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-gray-300 mb-1">
              Apellido
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-[#2B2E33] text-white
                 border border-gray-600
                 focus:outline-none focus:border-[#E50914]
                 hover:border-[#E50914] transition"
              required
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-gray-300 mb-1">
              Edad
            </label>
            <input
              id="age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-[#2B2E33] text-white
                 border border-gray-600
                 focus:outline-none focus:border-[#E50914]
                 hover:border-[#E50914] transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-300 mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-[#2B2E33] text-white
                 border border-gray-600
                 focus:outline-none focus:border-[#E50914]
                 hover:border-[#E50914] transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#E50914] hover:bg-[#b0060f] text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/ProfilePage"
            className="text-[#E50914] font-medium hover:underline"
          >
            Volver al perfil
          </Link>
        </div>
      </div>
    </div>
  );
};
