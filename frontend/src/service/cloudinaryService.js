import {
  baseUrl,
  CLOUD_NAME,
  UPLOAD_PRESET_SIGNED,
  CLOUDINARY_UPLOAD_URL,
} from "../utils/constants";
export const CLOUD_NAME = "dzcym3dh4";

export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

// ...otros exports

// Subida de imagen de PRODUCTO
export const uploadProductImage = async (file, publicId, signatureData) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("public_id", publicId);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", signatureData.timestamp);
  formData.append("signature", signatureData.signature);
  formData.append("upload_preset", UPLOAD_PRESET_SIGNED);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.public_id || !data.format) {
    throw new Error(
      "Error al subir la imagen a Cloudinary: " +
        (data.error?.message || "Respuesta inesperada")
    );
  }

  return `${data.public_id.split("/").pop()}.${data.format}`;
};

// Subida de imagen de PERFIL
export const uploadProfileImage = async (file, publicId, signatureData) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("public_id", publicId);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", signatureData.timestamp);
  formData.append("signature", signatureData.signature);
  formData.append("upload_preset", UPLOAD_PRESET_SIGNED);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};

// Obtener firma para subida firmada
export const getSignature = async (publicId) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(
    `${baseUrl}/cloudinary/signature?publicId=${publicId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("No se pudo obtener la firma");
  }

  return await res.json();
};

// Eliminar imagen de Cloudinary desde tu backend
export const deleteImageFromCloudinary = async (publicId) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${baseUrl}/cloudinary/delete/${publicId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al eliminar la imagen de Cloudinary");
  }

  return await res.text();
};
