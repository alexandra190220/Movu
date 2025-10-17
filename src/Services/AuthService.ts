const API_URL = "http://localhost:3000/api/v1"; // cambiar cuando se despliegue en vercel

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/sessions/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "Error al iniciar sesión");

  return data; // { message, userId }
}

export async function registerUser(firstName: string, lastName: string, age: number, email: string, password: string) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, age, email, password }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "Error al registrarse");
  console.log(data.error());

  return data;
}
