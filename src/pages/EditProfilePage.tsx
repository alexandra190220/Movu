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
    <div className="bg-[#2b2f33] text-white px-4 pt-20 pb-10 min-h-[80vh] flex justify-center items-center">
      <div className="bg-[#3a3f45] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Editar Perfil</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Nombre"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-red-500 hover:ring-2 hover:ring-red-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Apellido</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Apellido"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-red-500 hover:ring-2 hover:ring-red-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Edad</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Edad"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-red-500 hover:ring-2 hover:ring-red-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-red-500 hover:ring-2 hover:ring-red-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition ${
              saving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        <p className="text-gray-300 text-sm text-center mt-6">
          <Link to="/ProfilePage" className="text-red-500 hover:underline font-medium">
            Volver al perfil
          </Link>
        </p>
      </div>
    </div>
  );
};
