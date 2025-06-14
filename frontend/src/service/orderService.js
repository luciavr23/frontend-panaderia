import {baseUrl} from "../utils/constants";

// Obtener pedidos del usuario actual
export async function getMyOrders(token) {
  const res = await fetch(`${baseUrl}/orders/my`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  if (!res.ok) throw new Error("No se pudieron obtener tus pedidos");
  return await res.json();
}

// Obtener pedidos de hoy
export async function getTodayOrders(token) {
  const res = await fetch(`${baseUrl}/orders/today`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  if (!res.ok) throw new Error("No se pudieron obtener los pedidos de hoy");
  return await res.json();
}

// Actualizar estado de un pedido
export async function updateOrderStatus(orderId, status, token) {
  const res = await fetch(
    `${baseUrl}/orders/${orderId}/status?status=${status}`,
    {
      method: "PUT",
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );

  if (!res.ok) throw new Error("No se pudo actualizar el estado del pedido");
  return await res.json();
}

// Crear un nuevo pedido
export async function createOrder(order, token) {
  const res = await fetch(`${baseUrl}/orders/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) throw new Error("Could not create order");
  return await res.json();
}

// Crear pedido con intento de pago
export async function createOrderWithPayment(cart, paymentIntentId, token) {
  const body = {
    products: cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
    paymentIntentId,
  };

  const res = await fetch(`${baseUrl}/orders/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "No se pudo crear el pedido con pago");
  }

  return await res.json();
}

// Obtener pedido por ID
export const getOrderById = async (id, token) => {
  const response = await fetch(`${baseUrl}/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("No se pudo obtener el pedido");
  return await response.json();
};

// Validar stock
export async function validateStock(cart, token) {
  const res = await fetch(`${baseUrl}/products/validate-stock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(cart),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Stock insuficiente en algún producto.");
  }

  return true;
}

// Reenviar ticket
export async function resendOrderTicket(orderId, token) {
  const res = await fetch(`${baseUrl}/orders/${orderId}/resend-ticket`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  if (!res.ok) {
    let message = "Error al reenviar el ticket";
    try {
      const data = await res.json();
      message = data.message || message;
    } catch (_) {
      const text = await res.text();
      message = text || message;
    }
    throw new Error(message);
  }

  return await res.json();
}

// Obtener pedidos de un usuario por ID
export async function getOrdersByUserId(userId, token) {
  const res = await fetch(`${baseUrl}/orders/user/${userId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  if (!res.ok)
    throw new Error("No se pudieron obtener los pedidos del usuario");
  return await res.json();
}

// Eliminar pedido
export async function deleteOrder(orderId, token) {
  const res = await fetch(`${baseUrl}/orders/${orderId}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "No se pudo eliminar el pedido");
  }
}
