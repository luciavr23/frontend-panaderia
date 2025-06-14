// Obtener platos del día
export async function getDailySpecials() {
  try {
    const response = await fetch("/dailySpecials");
    if (!response.ok) throw new Error("Error al obtener platos del día");
    return await response.json();
  } catch (error) {
    console.error("dailySpecials:", error);
    return [];
  }
}
