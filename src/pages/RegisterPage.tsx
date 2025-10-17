import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../Services/AuthService";
import { validateField, validateForm } from "../Services/ValidateRegister";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value } as FormState;
    setForm(updatedForm);

    const error = validateField(name, value, updatedForm);
    setErrors((prev) => ({ ...prev, [name]: error }));

    if (name === "password" && updatedForm.confirmPassword) {
      const errConfirm = validateField("confirmPassword", updatedForm.confirmPassword, updatedForm);
      setErrors((prev) => ({ ...prev, confirmPassword: errConfirm }));
    }
  };

  const extractErrorMessage = (err: unknown): string => {
    if (!err) return "Error al registrar usuario";
    if (err instanceof Error) return err.message;
    try {
      const anyErr = err as any;
      if (anyErr.response?.data?.message) return String(anyErr.response.data.message);
      if (anyErr.message) return String(anyErr.message);
      if (typeof anyErr === "string") return anyErr;
    } catch {}
    return "Error al registrar usuario";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstKey = Object.keys(validationErrors)[0];
      document.querySelector<HTMLInputElement>(`input[name="${firstKey}"]`)?.focus();
      return;
    }

    try {
      setIsLoading(true);
      await registerUser(
        form.firstName,
        form.lastName,
        Number(form.age),
        form.email,
        form.password
      );
      alert("✅ Registro exitoso, ahora inicia sesión");
      navigate("/LoginPage");
    } catch (err) {
      const message = extractErrorMessage(err);
      if (message.includes("E11000") || message.includes("duplicate key")) {
        setSubmitError("Este correo ya está registrado. Intenta con otro.");
      } else {
        setSubmitError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center px-4 py-24">
        <form
          onSubmit={handleSubmit}
          className="bg-[#3a3f45] p-8 rounded-2xl shadow-lg w-full max-w-md"
          noValidate
        >
          <h2 className="text-3xl font-bold text-center mb-6">
            Crear cuenta
          </h2>

          {submitError && (
            <p className="text-red-400 text-center mb-4 text-sm">{submitError}</p>
          )}

          {/* Nombres */}
          <div>
            <label className="block text-sm mb-1">Nombres</label>
            <input
              name="firstName"
              placeholder="Escribe tu nombre"
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label className="block text-sm mb-1 mt-3">Apellidos</label>
            <input
              name="lastName"
              placeholder="Escribe tu apellido"
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Edad */}
          <div>
            <label className="block text-sm mb-1 mt-3">Edad</label>
            <input
              name="age"
              type="number"
              placeholder="Edad"
              value={form.age}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              min={0}
            />
            {errors.age && (
              <p className="text-red-400 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm mb-1 mt-3">Correo electrónico</label>
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="relative mt-3">
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 pr-10 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="relative mt-3">
            <label className="block text-sm mb-1">Confirmar contraseña</label>
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repite tu contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 pr-10 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Botón con animación */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Registrando...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </button>

          <p className="text-gray-300 text-sm text-center mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link to="/LoginPage" className="text-red-500 hover:underline font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
