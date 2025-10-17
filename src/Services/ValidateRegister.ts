// src/utils/validateRegister.ts
export interface FormValues {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Validators mejorados:
 * - age ahora maneja cadena vacía y valores no numéricos
 * - confirmPassword compara con formValues.password
 */
export const validators = {
  firstName: (value: string) =>
    value.trim() !== "" ? "" : "Ingresa tus nombres.",

  lastName: (value: string) =>
    value.trim() !== "" ? "" : "Ingresa tus apellidos.",

  age: (value: string) => {
    if (value === "" || value == null) return "Ingresa tu edad.";
    const n = Number(value);
    if (Number.isNaN(n)) return "Edad inválida.";
    return n >= 13 ? "" : "Debes tener al menos 13 años.";
  },

  email: (value: string) =>
    /\S+@\S+\.\S+/.test(value) ? "" : "Ingresa un correo válido.",

  password: (value: string) =>
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(value)
      ? ""
      : "Debe tener 8+ caracteres, 1 mayúscula, 1 número y 1 símbolo.",

  confirmPassword: (value: string, formValues: FormValues) =>
    value === formValues.password ? "" : "Las contraseñas no coinciden.",
};

/**
 * Valida un único campo
 */
export const validateField = (
  name: string,
  value: string,
  formValues: FormValues
): string => {
  const fn = (validators as any)[name];
  if (typeof fn !== "function") return "";
  return fn(value, formValues);
};

/**
 * Valida todo el formulario y devuelve objeto con errores
 */
export const validateForm = (formValues: FormValues): ValidationErrors => {
  const errors: ValidationErrors = {};
  (Object.keys(formValues) as Array<keyof FormValues>).forEach((k) => {
    const val = formValues[k] ?? "";
    const error = validateField(k, String(val), formValues);
    if (error) errors[k] = error;
  });
  return errors;
};
