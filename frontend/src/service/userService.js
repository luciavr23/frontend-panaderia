import {baseUrl} from "../utils/constants";

// Obtener el usuario actual
export async function getCurrentUser(token) {
  const res = await fetch(`${baseUrl}/users/me`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  if (!res.ok) throw new Error("No se pudo obtener el usuario");
  return await res.json();
}

// Actualizar datos del usuario actual
export const updateUser = async (userData, token) => {
  try {
    const response = await fetch(`${baseUrl}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updateUser service:", error);
    throw error;
  }
};
