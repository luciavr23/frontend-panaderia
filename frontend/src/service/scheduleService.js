// Obtener horario de la panadería

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function getSchedule() {
  try {
    const response = await fetch("/schedules");
    if (!response.ok) throw new Error("Error al obtener el horario");

    const data = await response.json();

    return data.map((item) => ({
      ...item,
      weekday: capitalizeFirstLetter(item.dayOfWeek.toLowerCase()),
      hours: item.closed ? "Cerrado" : `${item.openTime}–${item.closeTime}`,
    }));
  } catch (error) {
    console.error("getSchedule:", error);
    return [];
  }
}

//actualizar horario de la panadería
export const updateSchedule = async (id, scheduleDTO, token) => {
  const response = await fetch(`/schedules/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(scheduleDTO),
  });

  if (!response.ok) throw new Error("Error al actualizar el horario");
  return await response.json();
};
