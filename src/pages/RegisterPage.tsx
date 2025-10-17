// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Services/AuthService";
import { Link } from "react-router-dom";
import { validateField, validateForm } from "../Services/ValidateRegister";

type FormState = {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [submitError, setSubmitError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value } as FormState;
    setForm(updatedForm);

    // Validación en tiempo real del campo modificado
    const error = validateField(name, value, updatedForm);
    setErrors((prev) => ({ ...prev, [name]: error }));
    // Si confirmPassword o password cambian, revalidar la otra parte
    if (name === "password" && updatedForm.confirmPassword) {
      const errConfirm = validateField("confirmPassword", updatedForm.confirmPassword, updatedForm);
      setErrors((prev) => ({ ...prev, confirmPassword: errConfirm }));
    }
    if (name === "confirmPassword" && updatedForm.password) {
      const errPass = validateField("password", updatedForm.password, updatedForm);
      setErrors((prev) => ({ ...prev, password: errPass }));
    }
  };

  const extractErrorMessage = (err: unknown): string => {
    // Intenta extraer mensajes comunes (axios, fetch, Error)
    if (!err) return "Error al registrar usuario";
    if (err instanceof Error) return err.message;
    // posible objeto con response.data.message (axios)
    try {
      const anyErr = err as any;
      if (anyErr.response?.data?.message) return String(anyErr.response.data.message);
      if (anyErr.message) return String(anyErr.message);
      if (typeof anyErr === "string") return anyErr;
    } catch {
      // ignore
    }
    return "Error al registrar usuario";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Foco en primer error opcionalmente
      const firstKey = Object.keys(validationErrors)[0];
      const el = document.querySelector<HTMLInputElement>(`input[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    try {
      await registerUser(
        form.firstName,
        form.lastName,
        Number(form.age),
        form.email,
        form.password
      );
      alert("Registro exitoso, ahora inicia sesión");
      navigate("/LoginPage");
    } catch (err) {
      const message = extractErrorMessage(err);
      setSubmitError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2f3336] px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-[#3a3d3f] p-8 rounded-lg shadow-lg w-full max-w-lg"
        noValidate
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-white mb-8">
          Registro de Usuario
        </h2>

        {submitError && (
          <p className="text-red-400 text-center mb-4 text-sm">{submitError}</p>
        )}

        {/* Nombres */}
        <div className="mb-4">
          <label className="text-white text-sm block mb-1">Nombres:</label>
          <input
            name="firstName"
            placeholder="Escribe tu nombre"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "error-firstName" : undefined}
          />
          {errors.firstName && (
            <p id="error-firstName" className="text-red-400 text-sm mt-1">
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Apellidos */}
        <div className="mb-4">
          <label className="text-white text-sm block mb-1">Apellidos:</label>
          <input
            name="lastName"
            placeholder="Escribe tu apellido"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "error-lastName" : undefined}
          />
          {errors.lastName && (
            <p id="error-lastName" className="text-red-400 text-sm mt-1">
              {errors.lastName}
            </p>
          )}
        </div>

        {/* Edad */}
        <div className="mb-4">
          <label className="text-white text-sm block mb-1">Edad:</label>
          <input
            name="age"
            type="number"
            placeholder="Edad"
            value={form.age}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            aria-invalid={!!errors.age}
            aria-describedby={errors.age ? "error-age" : undefined}
            min={0}
          />
          {errors.age && (
            <p id="error-age" className="text-red-400 text-sm mt-1">
              {errors.age}
            </p>
          )}
        </div>

        {/* Correo */}
        <div className="mb-4">
          <label className="text-white text-sm block mb-1">
            Correo electrónico:
          </label>
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "error-email" : undefined}
          />
          {errors.email && (
            <p id="error-email" className="text-red-400 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Contraseña */}
        <div className="mb-4">
          <label className="text-white text-sm block mb-1">Contraseña:</label>
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "error-password" : undefined}
          />
          {errors.password && (
            <p id="error-password" className="text-red-400 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div className="mb-4">
          <label className="text-white text-sm block mb-1">
            Confirmar contraseña:
          </label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "error-confirmPassword" : undefined}
          />
          {errors.confirmPassword && (
            <p id="error-confirmPassword" className="text-red-400 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
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
