import {baseUrl} from "../utils/constants";

// Obtener información de contacto
export async function getContactInfo() {
  try {
    const response = await fetch(`${baseUrl}/info`);
    if (!response.ok) {
      throw new Error("Error al obtener información de contacto");
    }
    return await response.json();
  } catch (error) {
    console.error("getContactInfo:", error);
    return null;
  }
}

// Actualizar información de contacto
export const updateBakeryInfo = async (id, data) => {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${baseUrl}/info/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la información");
  }

  return await response.json();
};
