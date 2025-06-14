export async function getCurrentUser(token) {
  const res = await fetch("/users/me", {
    headers: {Authorization: token ? `Bearer ${token}` : undefined},
  });
  if (!res.ok) throw new Error("No se pudo obtener el usuario");
  return await res.json();
}

export const updateUser = async (userData, token) => {
  try {
    const response = await fetch("/users/me", {
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

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error in updateUser service:", error);
    throw error;
  }
};
