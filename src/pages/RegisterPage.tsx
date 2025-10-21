import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../Services/AuthService";
import { validateField, validateForm } from "../Services/ValidateRegister";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

type FormState = {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/**
 * RegisterPage Component
 *
 * This component renders the registration page for new users. It includes
 * form validation for each field, password confirmation checks, visual
 * feedback for errors and success messages, and a loading indicator during submission.
 *
 * @component
 * @example
 * return (
 *   <RegisterPage />
 * )
 *
 * @returns {JSX.Element} The rendered RegisterPage component.
 *
 * @accessibility
 * - **WCAG 2.1 - 3.3.3 Error Suggestion:**  
 *   When an input error occurs, the component provides clear feedback and guidance
 *   on how to correct the issue (e.g., missing fields, invalid email format).
 */
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
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Handles form input changes and triggers validation for each field.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
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

  /**
   * Extracts a readable error message from different error object types.
   *
   * @param {unknown} err - The error object thrown during registration.
   * @returns {string} A readable error message.
   */
  const extractErrorMessage = (err: unknown): string => {
    if (!err) return "Error registering user";
    if (err instanceof Error) return err.message;
    try {
      const anyErr = err as any;
      if (anyErr.response?.data?.message) return String(anyErr.response.data.message);
      if (anyErr.message) return String(anyErr.message);
      if (typeof anyErr === "string") return anyErr;
    } catch {}
    return "Error registering user";
  };

  /**
   * Handles the form submission.
   * Validates input, registers the user, and provides visual feedback.
   *
   * @async
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>} Redirects to LoginPage upon successful registration.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");
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

      setSuccessMessage("✅ Cuenta creada exitosamente! Redirigiendo al inicio de sesión...");
      setTimeout(() => navigate("/LoginPage"), 2500);
    } catch (err) {
      const message = extractErrorMessage(err);
      if (message.includes("E11000") || message.includes("duplicate key")) {
        setSubmitError("Este correo electrónico ya está registrado. Intenta con otro.");
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
          <h2 className="text-3xl font-bold text-center mb-6">Crear cuenta</h2>

          <div>
            <label className="block text-sm mb-1">Nombres</label>
            <input
              name="firstName"
              placeholder="Escribe tu nombre"
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1 mt-3">Apellidos</label>
            <input
              name="lastName"
              placeholder="Escribe tu apellido"
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
          </div>

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
            {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
          </div>

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
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

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
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

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

          <div className="mt-4">
            {submitError && (
              <p className="text-red-400 text-center mb-2 text-sm">{submitError}</p>
            )}
            {successMessage && (
              <div className="flex items-center justify-center gap-2 text-green-400 text-center mb-2 text-sm animate-fade-in">
                <CheckCircle2 size={18} />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
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