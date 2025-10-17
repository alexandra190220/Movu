import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Services/AuthService";
import { Link } from "react-router-dom";
import { validateField, validateForm } from "../Services/ValidateRegister";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // 👁️ + ⏳ iconos

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
  const [isLoading, setIsLoading] = useState(false); // 🔹 Estado de carga

  // 👁️ Mostrar/ocultar contraseñas
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
    if (name === "confirmPassword" && updatedForm.password) {
      const errPass = validateField("password", updatedForm.password, updatedForm);
      setErrors((prev) => ({ ...prev, password: errPass }));
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
      setIsLoading(true); // ⏳ Empieza el estado de carga
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
      setIsLoading(false); // ⏹️ Finaliza carga
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-[#2f3336] px-6 py-24">
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
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
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
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
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
              min={0}
            />
            {errors.age && (
              <p className="text-red-400 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          {/* Correo */}
          <div className="mb-4">
            <label className="text-white text-sm block mb-1">Correo electrónico:</label>
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="mb-4 relative">
            <label className="text-white text-sm block mb-1">Contraseña:</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 pr-10 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="mb-6 relative">
            <label className="text-white text-sm block mb-1">Confirmar contraseña:</label>
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repite tu contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 pr-10 rounded-md bg-[#e9e9e9] text-black placeholder-gray-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Botón con spinner */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#d71920] hover:bg-[#b01315] text-white font-semibold px-6 py-2 rounded-md transition flex items-center justify-center gap-2 ${
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
          </div>

          <p className="mt-4 text-center text-sm text-gray-300">
            ¿Ya tienes cuenta?{" "}
            <Link to="/LoginPage" className="text-[#d71920] hover:underline font-medium">
              Inicia Sesión
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
