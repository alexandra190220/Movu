import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Services/AuthService";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(
        form.firstName,
        form.lastName,
        Number(form.age),
        form.email,
        form.password
      );
      alert("Registro exitoso, ahora inicia sesión");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Error en el registro");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2f3336] px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#3a3d3f] p-8 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-white mb-8">
          Registro de Usuario
        </h2>

        {error && (
          <p className="text-red-400 text-center mb-4 text-sm">{error}</p>
        )}

        <div className="grid gap-3">
          <div>
            <label className="text-white text-sm font-medium block mb-1">
              Nombres:
            </label>
            <input
              name="firstName"
              placeholder="Escribe tu nombre"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium block mb-1">
              Apellidos:
            </label>
            <input
              name="lastName"
              placeholder="Escribe tu apellido"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium block mb-1">
              Edad:
            </label>
            <input
              name="age"
              type="number"
              placeholder="Edad"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium block mb-1">
              Correo electrónico:
            </label>
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium block mb-1">
              Contraseña:
            </label>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              onChange={handleChange}
              required
              className="w-full p-2 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-[#d71920] hover:bg-[#b01315] text-white font-semibold px-6 py-2 rounded-full transition"
          >
            Crear Cuenta
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-300">
          ¿Ya tienes cuenta?{" "}
          <Link to="/LoginPage" className="text-[#d71920] hover:underline font-medium">
            Inicia Sesión
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
