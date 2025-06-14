import React, {useState} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  IconButton,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import {
  getSignature,
  uploadProductImage,
  CLOUDINARY_BASE_URL,
} from "../../service/cloudinaryService";
import {createProduct} from "../../service/productService";

const isValidPrice = (value) => {
  return /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value);
};

const isValidStock = (value) => {
  return (
    /^(?:[0-9]{1,3})$/.test(value) && Number(value) >= 0 && Number(value) <= 999
  );
};

const AddProductModal = ({
  open,
  onClose,
  onSuccess,
  categoryId,
  categoryName,
  allAlergenos,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [available, setAvailable] = useState(true);
  const [selectedAlergenos, setSelectedAlergenos] = useState([]);
  const [imageFiles, setImageFiles] = useState([null, null]);
  const [previewUrls, setPreviewUrls] = useState([null, null]);
  const [alergenosModal, setAlergenosModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [nameError, setNameError] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleImageChange = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...imageFiles];
      const newPreviews = [...previewUrls];
      newFiles[idx] = file;
      newPreviews[idx] = URL.createObjectURL(file);
      setImageFiles(newFiles);
      setPreviewUrls(newPreviews);
      if ((idx === 0 && newPreviews[1]) || (idx === 1 && newPreviews[0])) {
        setError("");
      }
    }
  };

  const toggleAlergeno = (id) => {
    setSelectedAlergenos((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setAvailable(true);
    setSelectedAlergenos([]);
    setImageFiles([null, null]);
    setPreviewUrls([null, null]);
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("El nombre no puede estar vacío.");
      setLoading(false);
      return;
    }
    if (/\s{2,}/.test(name)) {
      setNameError("No se permiten espacios múltiples.");
      setLoading(false);
      return;
    }
    setNameError("");
    setLoading(true);
    if (!name.trim() || !description.trim() || !price || !stock) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }
    if (!isValidPrice(price)) {
      setError(
        "El precio debe ser un número válido (ej: 0.15, 1, 2.50) sin ceros a la izquierda."
      );
      setLoading(false);
      return;
    }
    if (!isValidStock(stock)) {
      setError("El stock debe ser un número entre 0 y 999.");
      setLoading(false);
      return;
    }
    if (!imageFiles[0] || !imageFiles[1]) {
      setError("Debes subir dos imágenes.");
      setLoading(false);
      return;
    }
    try {
      const images = [];
      for (let i = 0; i < 2; i++) {
        const file = imageFiles[i];
        const publicId = `product-${name
          .replace(/\s+/g, "-")
          .toLowerCase()}-${Date.now()}-${i}`;
        const signatureData = await getSignature(publicId);
        const imageName = await uploadProductImage(
          file,
          publicId,
          signatureData
        );
        images.push({imageUrl: imageName, order: i});
      }
      const product = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
        available,
        categoryId,
        allergens: allAlergenos.filter((a) => selectedAlergenos.includes(a.id)),
        images,
      };
      await createProduct(product);
      onSuccess();
      resetForm();
      onClose();
    } catch (err) {
      setError("Error al crear el producto. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: 6,
          maxWidth: fullScreen ? "100%" : 700,
          width: "100%",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            color: "#333",
            fontSize: 26,
          }}
        >
          Añadir Producto
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{pt: 4, px: fullScreen ? 2 : 4}}>
          <Box sx={{display: "flex", flexDirection: "column", gap: 2.5}}>
            <TextField
              label="Nombre del producto"
              value={name}
              onChange={(e) => {
                let val = e.target.value
                  .replace(/^\s+|\s+$/g, "")
                  .replace(/\s{2,}/g, " ");
                setName(val);

                if (!val) {
                  setNameError("El nombre no puede estar vacío.");
                } else if (/\s{2,}/.test(e.target.value)) {
                  setNameError("No se permiten espacios múltiples.");
                } else {
                  setNameError("");
                }
              }}
              fullWidth
              required
              error={!!nameError}
              helperText={nameError}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {borderColor: "#8DBB01"},
                  "& fieldset": {borderColor: "#8DBB01"},
                },
                "& .MuiInputLabel-root.Mui-focused": {color: "#8DBB01"},
                "& .MuiInputLabel-root": {
                  backgroundColor: "#fffdfa",
                  px: 1,
                },
              }}
            />
            <TextField
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {borderColor: "#8DBB01"},
                  "& fieldset": {borderColor: "#8DBB01"},
                },
                "& .MuiInputLabel-root.Mui-focused": {color: "#8DBB01"},
                "& .MuiInputLabel-root": {
                  backgroundColor: "#fffdfa",
                  px: 1,
                },
              }}
            />
            <TextField
              label="Precio"
              type="text"
              value={price}
              onChange={(e) => {
                let val = e.target.value.replace(",", ".");
                val = val.replace(/[^0-9.]/g, "");
                const parts = val.split(".");
                if (parts.length > 2) {
                  val = parts[0] + "." + parts.slice(1).join("");
                }
                if (val.includes(".")) {
                  const [intPart, decPart] = val.split(".");
                  val = intPart + "." + (decPart ? decPart.slice(0, 2) : "");
                }

                if (!val.includes(".") && val.length > 2) {
                  val = val.slice(0, 2);
                }
                setPrice(val);

                if (val === "0" || val === "0.0" || val === "0.00") {
                  setPriceError("El precio no puede ser 0.");
                } else {
                  setPriceError("");
                }
              }}
              fullWidth
              required
              error={!!priceError}
              helperText={priceError}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {borderColor: "#8DBB01"},
                  "& fieldset": {borderColor: "#8DBB01"},
                },
                "& .MuiInputLabel-root.Mui-focused": {color: "#8DBB01"},
                "& .MuiInputLabel-root": {
                  backgroundColor: "#fffdfa",
                  px: 1,
                },
              }}
              inputProps={{step: "0.01", min: 0, inputMode: "decimal"}}
            />
            <TextField
              label="Stock"
              type="text"
              value={stock}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.length > 1) {
                  val = val.replace(/^0+/, "");
                }

                if (val === "") {
                  setStock("");
                  setAvailable(false);
                  return;
                }
                if (
                  val === "0" ||
                  (val.length > 0 && /^[1-9][0-9]{0,2}$/.test(val))
                ) {
                  setStock(val);

                  if (val === "0") setAvailable(false);
                }
              }}
              fullWidth
              required
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {borderColor: "#8DBB01"},
                  "& fieldset": {borderColor: "#8DBB01"},
                },
                "& .MuiInputLabel-root.Mui-focused": {color: "#8DBB01"},
                "& .MuiInputLabel-root": {
                  backgroundColor: "#fffdfa",
                  px: 1,
                },
              }}
              inputProps={{
                min: 0,
                max: 999,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  sx={{color: "#8DBB01", "&.Mui-checked": {color: "#8DBB01"}}}
                  disabled={stock === "0" || stock === ""}
                />
              }
              label="Disponible"
              sx={{mb: 2}}
            />
            <TextField
              label="Categoría"
              value={categoryName}
              fullWidth
              disabled
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {borderColor: "#8DBB01"},
                },
                "& .MuiInputLabel-root.Mui-focused": {color: "#8DBB01"},
              }}
            />
            <Box sx={{mb: 2}}>
              <Typography variant="subtitle1" sx={{mb: 1}}>
                Imágenes del producto (2 obligatorias):
              </Typography>
              <Grid container spacing={2}>
                {[0, 1].map((idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Box
                      sx={{
                        position: "relative",
                        width: "200px",
                        height: {xs: 180, sm: 220},
                        border: "2px dashed #8DBB01",
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#fafafa",
                        transition: "border-color 0.2s",
                        overflow: "hidden",
                      }}
                    >
                      {previewUrls[idx] ? (
                        <img
                          src={previewUrls[idx]}
                          alt={`preview-${idx}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 12,
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Imagen {idx + 1}
                        </Typography>
                      )}
                      <IconButton
                        component="label"
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          right: 16,
                          bgcolor: "rgba(255,255,255,0.95)",
                          boxShadow: 1,
                          "&:hover": {bgcolor: "#e6f5c6"},
                        }}
                      >
                        <PhotoCamera sx={{color: "#8DBB01"}} />
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, idx)}
                        />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              {error === "Debes subir dos imágenes." && (
                <Typography color="error" sx={{mt: 2}}>
                  {error}
                </Typography>
              )}
            </Box>
            <Box sx={{mb: 2}}>
              <Button
                variant="outlined"
                onClick={() => setAlergenosModal(true)}
                sx={{
                  color: "#5a774a",
                  borderColor: "#8DBB01",
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: "none",
                  fontFamily: "'Inter', sans-serif",
                  "&:hover": {
                    background: "#f4fbe6",
                    borderColor: "#6c9814",
                  },
                }}
              >
                Seleccionar alérgenos
              </Button>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: 2,
                }}
              >
                {allAlergenos
                  .filter((a) => selectedAlergenos.includes(a.id))
                  .map((a) => (
                    <Box
                      key={a.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        border: "1px solid #8DBB01",
                        borderRadius: 2,
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      <img
                        src={a.iconUrl}
                        alt={a.name}
                        style={{width: 28, height: 28, objectFit: "contain"}}
                      />
                      <Typography variant="caption">{a.name}</Typography>
                    </Box>
                  ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{p: 3, pt: 0}}>
          <Button
            onClick={onClose}
            sx={{color: "#666", fontWeight: 500}}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !!priceError}
            sx={{
              bgcolor: "#8DBB01",
              color: "white",
              px: 4,
              py: 1,
              borderRadius: 2,
              "&:hover": {bgcolor: "#5a774a"},
              textTransform: "none",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              position: "relative",
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{color: "white"}} />
            ) : (
              "Crear Producto"
            )}
          </Button>
        </DialogActions>
      </form>

      <Dialog
        open={alergenosModal}
        onClose={() => setAlergenosModal(false)}
        maxWidth="xs"
      >
        <DialogTitle>Selecciona los alérgenos</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {allAlergenos.map((alergeno) => (
              <Grid item key={alergeno.id} xs={4} sm={3}>
                <Box
                  onClick={() => toggleAlergeno(alergeno.id)}
                  sx={{
                    border: selectedAlergenos.includes(alergeno.id)
                      ? "2px solid #8DBB01"
                      : "2px solid #e0e0e0",
                    borderRadius: 2,
                    p: 1,
                    cursor: "pointer",
                    textAlign: "center",
                    background: selectedAlergenos.includes(alergeno.id)
                      ? "#f4fbe6"
                      : "#fff",
                    transition: "all 0.2s",
                    minWidth: 70,
                  }}
                >
                  <img
                    src={alergeno.iconUrl}
                    alt={alergeno.name}
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "contain",
                      marginBottom: 4,
                    }}
                  />
                  <Typography variant="caption" sx={{fontSize: 13}}>
                    {alergeno.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{color: "#8DBB01"}}
            onClick={() => setAlergenosModal(false)}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default AddProductModal;
