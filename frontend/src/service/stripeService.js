// hacer un pago

export async function createPaymentIntent(amount, email, token) {
  const response = await fetch("/payment/create-payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // convierte a céntimos
      currency: "eur",
      receiptEmail: email,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al crear el intento de pago");
  }

  const data = await response.json();
  if (!data.clientSecret) {
    throw new Error("No se pudo obtener el clientSecret");
  }

  return data.clientSecret;
}

// Confirmar pago de un pedido existente
export async function confirmPaymentForExistingOrder(
  orderId,
  paymentIntentId,
  token
) {
  const res = await fetch("/payment/for-existing-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify({
      orderId,
      paymentIntentId,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "No se pudo confirmar el pago del pedido");
  }

  return await res.json();
}
