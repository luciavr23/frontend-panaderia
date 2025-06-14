import {baseUrl} from "../utils/constants";

// Obtener categorías paginadas
export async function getAllCategories(
  page = 0,
  sortBy = "name",
  direction = "asc"
) {
  try {
    const url = `${baseUrl}/categories?page=${page}&sortBy=${sortBy}&direction=${direction}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Error al obtener categorías paginadas");
    return await response.json();
  } catch (error) {
    console.error("getCategories:", error);
    return {content: [], totalPages: 0};
  }
}

// Obtener todas las categorías sin paginación
export async function getAllCategoriesRaw() {
  try {
    const response = await fetch(`${baseUrl}/categories/all`);
    if (!response.ok) throw new Error("Error al obtener todas las categorías");
    return await response.json();
  } catch (error) {
    console.error("getAllCategoriesRaw:", error);
    return [];
  }
}

// Crear una nueva categoría
export async function createCategory(category) {
  try {
    const response = await fetch(`${baseUrl}/categories`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(category),
    });

    if (!response.ok) throw new Error("Error al crear categoría");
    return await response.json();
  } catch (error) {
    console.error("createCategory:", error);
    throw error;
  }
}

// Actualizar una categoría existente
export async function updateCategory(id, category) {
  try {
    const response = await fetch(`${baseUrl}/categories/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(category),
    });

    if (!response.ok) throw new Error("Error al actualizar categoría");
    return await response.json();
  } catch (error) {
    console.error("updateCategory:", error);
    throw error;
  }
}

// Eliminar una categoría
export async function deleteCategory(id) {
  try {
    const response = await fetch(`${baseUrl}/categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Error al eliminar categoría");
  } catch (error) {
    console.error("deleteCategory:", error);
    throw error;
  }
}
