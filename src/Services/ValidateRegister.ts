/**
 * @file validateRegister.ts
 * @description Provides form validation utilities for user registration, ensuring that inputs meet required criteria such as email format, password strength, and age restrictions.
 *
 * 🧩 Accessibility (WCAG 2.1) Guidelines Applied:
 * - **WCAG 2.1 – Principle 1: Perceivable** → Clear and consistent error messages help users understand what information is missing or invalid.
 * - **WCAG 2.1 – Principle 2: Operable** → Logical field validation promotes predictable user interactions.
 * - **WCAG 2.1 – Principle 3: Understandable** → All feedback messages are descriptive and actionable, guiding users to fix issues.
 * - **WCAG 2.1 – Principle 4: Robust** → Validation logic follows standardized input formats for compatibility with assistive technologies.
 */

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
 * @constant
 * @name validators
 * @description
 * Contains validation rules for each form field.
 *
 * - Validates non-empty fields for names.
 * - Ensures age is numeric, not empty, and at least 13.
 * - Checks for valid email structure.
 * - Enforces password security pattern.
 * - Confirms password match.
 *
 * @accessibility
 * - Each validator provides user-friendly messages describing what must be corrected (WCAG 2.1 - 3.3.1 Error Identification).
 * - Prevents incomplete or invalid submissions through explicit checks (WCAG 2.1 - 3.3.4 Error Prevention).
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
 * Validates a single form field.
 *
 * @function validateField
 * @param {string} name - The name of the field being validated.
 * @param {string} value - The value entered by the user.
 * @param {FormValues} formValues - The entire set of form values (used for contextual checks like password confirmation).
 * @returns {string} Returns an error message if invalid, or an empty string if valid.
 *
 * @accessibility
 * - Provides immediate feedback per field for real-time error correction (WCAG 2.1 - 3.3.3 Error Suggestion).
 * - Encourages accessible form design with contextual validation (WCAG 2.1 - 3.3.2 Labels or Instructions).
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
 * Validates the entire form and returns an object containing any field errors.
 *
 * @function validateForm
 * @param {FormValues} formValues - All current values from the registration form.
 * @returns {ValidationErrors} An object mapping field names to their respective error messages.
 *
 * @accessibility
 * - Ensures complete form validation before submission (WCAG 2.1 - 3.3.4 Error Prevention).
 * - Provides structured, machine-readable feedback for compatibility with assistive tools (WCAG 2.1 - 4.1.2 Name, Role, Value).
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
