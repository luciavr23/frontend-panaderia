import {baseUrl} from "../utils/constants";

// Obtener reseñas aleatorias
export async function getReviews() {
  try {
    const response = await fetch(`${baseUrl}/reviews/limited`);
    if (!response.ok) throw new Error("Error al obtener reseñas");
    return await response.json(); // ✅ lista de ReviewDTO
  } catch (error) {
    console.error("reviews:", error);
    return [];
  }
}

// Obtener todas las reseñas
export async function getAllReviews() {
  try {
    const response = await fetch(`${baseUrl}/reviews`);
    if (!response.ok) throw new Error("Error al obtener reseñas");
    return await response.json();
  } catch (error) {
    console.error("getAllReviews:", error);
    return [];
  }
}

// Obtener valoración de un pedido concreto
export async function getReviewByOrder(orderId) {
  try {
    const response = await fetch(`${baseUrl}/reviews/order/${orderId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("getReviewByOrder:", error);
    return null;
  }
}

// Enviar nueva reseña
export async function addReview(review, token) {
  try {
    const response = await fetch(`${baseUrl}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) throw new Error("Error al enviar la reseña");
    return await response.json();
  } catch (error) {
    console.error("addReview:", error);
    throw error;
  }
}
