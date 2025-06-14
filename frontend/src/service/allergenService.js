export async function getAllAllergens() {
  const res = await fetch("/allergens");
  if (!res.ok) throw new Error("Error al obtener alérgenos");
  return await res.json();
} 