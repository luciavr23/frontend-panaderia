//Obtener estadísticas de administrador
export const getAdminStats = async (token) => {
  const res = await fetch("/admin/stats", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al cargar estadísticas");
  return res.json();
};
