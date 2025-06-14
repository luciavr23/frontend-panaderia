const CLOUD_NAME = "dzcym3dh4";
const UPLOAD_PRESET_SIGNED = "panaderia";
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

// ✅ Subida de imagen de PRODUCTO (firmada, preset SIGNED)
export const uploadProductImage = async (file, publicId, signatureData) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("public_id", publicId);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", signatureData.timestamp);
  formData.append("signature", signatureData.signature);
  formData.append("upload_preset", UPLOAD_PRESET_SIGNED);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  if (!data.public_id || !data.format) {
    throw new Error(
      "Error al subir la imagen a Cloudinary: " +
        (data.error?.message || "Respuesta inesperada")
    );
  }
  // Devuelve el nombre de la imagen para guardar en la BD
  return `${data.public_id.split("/").pop()}.${data.format}`;
};
// ✅ Subida de imagen de PERFIL (firmada, preset SIGNED)
export const uploadProfileImage = async (file, publicId, signatureData) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("public_id", publicId); // ej: profile_pictures/user_42
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", signatureData.timestamp);
  formData.append("signature", signatureData.signature);
  formData.append("upload_preset", UPLOAD_PRESET_SIGNED);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};

// ✅ Obtener firma para subida firmada
export const getSignature = async (publicId) => {
  const token = sessionStorage.getItem("token"); // <-- Aquí obtienes el token

  const res = await fetch(
    `http://localhost:8080/cloudinary/signature?publicId=${publicId}`,
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

//eliminar imagen de Cloudinary
export const deleteImageFromCloudinary = async (publicId) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(
    `http://localhost:8080/cloudinary/delete/${publicId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error("Error al eliminar la imagen de Cloudinary");
  }
  return await res.text();
};
