import {baseUrl} from "../utils/constants";

export async function getDailySpecials() {
  try {
    const response = await fetch(`${baseUrl}/dailySpecials`);
    if (!response.ok) throw new Error("Error al obtener platos del día");
    return await response.json();
  } catch (error) {
    console.error("dailySpecials:", error);
    return [];
  }
}
