import {baseUrl} from "../utils/constants";

export async function getAllAllergens() {
  const res = await fetch(`${baseUrl}/allergens`);
  if (!res.ok) throw new Error("Error al obtener alérgenos");
  return await res.json();
}
