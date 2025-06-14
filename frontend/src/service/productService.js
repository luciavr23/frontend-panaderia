export async function getAvailableProducts(
  page = 0,
  sortBy = "name",
  direction = "asc",
  categoryId = null,
  search = ""
) {
  try {
    let url = `/products/available?page=${page}&sortBy=${sortBy}&direction=${direction}`;
    if (categoryId !== null) url += `&categoryId=${categoryId}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al obtener productos disponibles");

    return await response.json(); // Recibes Page<ProductDTO>
  } catch (error) {
    console.error("getAvailableProducts:", error);
    return {content: [], totalPages: 0};
  }
}

export async function getAllProducts(
  page = 0,
  sortBy = "name",
  direction = "asc",
  categoryId = null,
  search = ""
) {
  try {
    let url = `/products?page=${page}&sortBy=${sortBy}&direction=${direction}`;
    if (categoryId !== null) url += `&categoryId=${categoryId}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al obtener todos los productos");

    return await response.json(); // Recibes Page<ProductDTO>
  } catch (error) {
    console.error("getAllProducts:", error);
    return {content: [], totalPages: 0};
  }
}

// Obtener productos populares
export async function getPopularProducts() {
  try {
    const response = await fetch("/products/popular");
    if (!response.ok) throw new Error("Error al obtener productos populares");
    return await response.json();
  } catch (error) {
    console.error("popularProducts:", error);
    return [];
  }
}

export async function updateProduct(id, product) {
  try {
    const response = await fetch(`/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) throw new Error("Error al actualizar el producto");

    return await response.json();
  } catch (error) {
    console.error("updateProduct:", error);
    throw error;
  }
}

export async function createProduct(product) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch("/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Error al crear el producto");
    return await response.json();
  } catch (error) {
    console.error("createProduct:", error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`/products/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
      },
    });

    if (!response.ok) throw new Error("Error al eliminar el producto");

    return true;
  } catch (error) {
    console.error("deleteProduct:", error);
    throw error;
  }
}
