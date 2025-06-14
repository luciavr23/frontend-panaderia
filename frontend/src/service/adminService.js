import {baseUrl} from "../utils/constants";

//Obtener estadísticas de administrador
export const getAdminStats = async (token) => {
  const res = await fetch(`${baseUrl}/admin/stats`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al cargar estadísticas");
  return res.json();
};
