export const API_URL = "https://movu-back-4mcj.onrender.com/api/v1";

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/sessions/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "Error al iniciar sesión");

  // 🔹 Solo guarda el userId, ya que el backend no envía token
  if (data.userId) {
    localStorage.setItem("userId", data.userId);
  } else {
    console.warn("No se recibió userId desde el backend");
  }

  return data; // { message, userId }
}


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
      // ✅ Usamos "message" en lugar de "error" (para coincidir con el backend)
      throw new Error(data.message || "Error al registrarse");
    }

    return data;
  } catch (error: any) {
    console.error("❌ Error al registrar usuario:", error);
    throw new Error(error.message || "Error al registrarse");
  }
}


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
export const updateUser = async (userId: string, data: any) => {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar usuario");
  return res.json();
};
