//Obtener reseñas aleatorias
export async function getReviews() {
  try {
    const response = await fetch("/reviews/limited");
    if (!response.ok) throw new Error("Error al obtener reseñas");
    return await response.json(); // ✅ aquí recibes la lista de ReviewDTO del back
  } catch (error) {
    console.error("reviews:", error);
    return [];
  }
}

// Obtener todas las reseñas
export async function getAllReviews() {
  try {
    const response = await fetch("/reviews");
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
    const response = await fetch(`/reviews/order/${orderId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("getReviewByOrder:", error);
    return null;
  }
}

// Enviar nueva reseña (ahora acepta token)
export async function addReview(review, token) {
  try {
    const response = await fetch("/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      throw new Error("Error al enviar la reseña");
    }

    return await response.json();
  } catch (error) {
    console.error("addReview:", error);
    throw error;
  }
}
