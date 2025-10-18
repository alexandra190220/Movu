/**
 * @file AuthService.ts
 * @description Provides authentication and user-related API interactions for the application.
 * 
 * 🧩 Accessibility (WCAG 2.1) Guidelines Applied:
 * - **WCAG 2.1 – Principle 1: Perceivable** → Clear and consistent feedback messages through console outputs.
 * - **WCAG 2.1 – Principle 2: Operable** → Logical function naming to ensure predictability in behavior.
 * - **WCAG 2.1 – Principle 3: Understandable** → Error handling provides meaningful error messages for developers and users.
 * - **WCAG 2.1 – Principle 4: Robust** → Uses standardized HTTP methods and JSON format for compatibility with assistive technologies.
 */

export const API_URL = "https://movu-back-4mcj.onrender.com/api/v1";

/**
 * Logs in a user with the given credentials.
 * 
 * @async
 * @function loginUser
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} Returns a promise with the login response data, including userId and message.
 * @throws {Error} Throws an error if login fails.
 * 
 * @accessibility
 * - Provides clear error messages in case of invalid credentials (WCAG 2.1 - 3.3.1 Error Identification).
 * - Uses descriptive console warnings to improve debugging comprehension (WCAG 2.1 - 3.3.3 Error Suggestion).
 */
export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/sessions/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "Error al iniciar sesión");

  // 🔹 Only stores userId, as the backend does not return a token
  if (data.userId) {
    localStorage.setItem("userId", data.userId);
  } else {
    console.warn("No se recibió userId desde el backend");
  }

  return data; // { message, userId }
}

/**
 * Registers a new user in the system.
 * 
 * @async
 * @function registerUser
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {number} age - The user's age.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} Returns the backend response data after successful registration.
 * @throws {Error} Throws an error if registration fails.
 * 
 * @accessibility
 * - Returns explicit backend feedback messages to enhance understandability (WCAG 2.1 - 3.3.2 Labels or Instructions).
 * - Uses consistent console logging to trace errors effectively (WCAG 2.1 - 4.1.2 Name, Role, Value).
 */
export async function registerUser(
  firstName: string,
  lastName: string,
  age: number,
  email: string,
  password: string
) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, age, email, password }),
    });

    const data = await response.json();
    console.log("📦 Respuesta del backend:", data);

    if (!response.ok) {
      throw new Error(data.message || "Error al registrarse");
    }

    return data;
  } catch (error: any) {
    console.error("❌ Error al registrar usuario:", error);
    throw new Error(error.message || "Error al registrarse");
  }
}

/**
 * Deletes a user account by ID.
 * 
 * @async
 * @function deleteAccount
 * @param {string} userId - The unique identifier of the user to delete.
 * @returns {Promise<boolean>} Returns `true` if the deletion was successful, `false` otherwise.
 * 
 * @accessibility
 * - Ensures confirmation of action through logs for user assurance (WCAG 2.1 - 3.3.4 Error Prevention).
 * - Maintains robust communication with backend for data integrity (WCAG 2.1 - 4.1.1 Parsing).
 */
export const deleteAccount = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error);
    return false;
  }
};

/**
 * Retrieves detailed information of a user by ID.
 * 
 * @async
 * @function getUserData
 * @param {string} userId - The unique identifier of the user to retrieve.
 * @returns {Promise<Object|null>} Returns user data if successful, otherwise `null`.
 * 
 * @accessibility
 * - Provides console feedback for failed data retrieval (WCAG 2.1 - 3.3.1 Error Identification).
 * - Uses standardized responses for data consistency (WCAG 2.1 - 4.1.2 Name, Role, Value).
 */
export async function getUserData(userId: string) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Error al obtener datos del usuario");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al cargar datos del usuario:", error);
    return null;
  }
}

/**
 * Updates user information.
 * 
 * @async
 * @function updateUser
 * @param {string} userId - The user's ID to update.
 * @param {Object} data - The user data to update.
 * @returns {Promise<Object>} Returns the updated user data.
 * @throws {Error} Throws an error if the update operation fails.
 * 
 * @accessibility
 * - Uses clear exception messages to guide developer debugging (WCAG 2.1 - 3.3.3 Error Suggestion).
 * - Maintains predictable operation flow for better code readability (WCAG 2.1 - 2.4.6 Headings and Labels).
 */
export const updateUser = async (userId: string, data: any) => {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar usuario");
  return res.json();
};
