import React, {useState, useEffect} from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import {
  getSignature,
  uploadProductImage,
  deleteImageFromCloudinary,
  CLOUDINARY_BASE_URL,
} from "../../service/cloudinaryService";

const EditProductModal = ({open, onClose, product, onSave, allAlergenos}) => {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [description, setDescription] = useState(product?.description || "");
  const [stock, setStock] = useState(product?.stock || "");
  const [available, setAvailable] = useState(product?.available ?? true);
  const [priceError, setPriceError] = useState("");
  const [nameError, setNameError] = useState("");

  const [popular, setPopular] = useState(product?.popular ?? false);
  const [selectedAlergenos, setSelectedAlergenos] = useState(
    product?.allergens?.map((a) => a.id) || []
  );
  const [imageFiles, setImageFiles] = useState([null, null]);
  const [previewUrls, setPreviewUrls] = useState([null, null]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    if (open) {
      setName(product?.name || "");
      setPrice(product?.price || "");
      setDescription(product?.description || "");
      setStock(
        product?.stock === 0 ? "0" : product?.stock ? String(product.stock) : ""
      );

      setAvailable(product?.available ?? true);
      setPopular(product?.popular ?? false);
      setSelectedAlergenos(product?.allergens?.map((a) => a.id) || []);
      setImageFiles([null, null]);
      setPreviewUrls(
        product?.images?.map(
          (img) => `${CLOUDINARY_BASE_URL}${img.imageUrl}`
        ) || [null, null]
      );
      setPriceError(false);
    }
  }, [open]);

  const handleImageChange = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...imageFiles];
      const newPreviews = [...previewUrls];
      newFiles[idx] = file;
      newPreviews[idx] = URL.createObjectURL(file);
      setImageFiles(newFiles);
      setPreviewUrls(newPreviews);
    }
  };

  const toggleAlergeno = (id) => {
    setSelectedAlergenos((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("El nombre no puede estar vacío.");
      return;
    }
    if (/\s{2,}/.test(name)) {
      setNameError("No se permiten espacios múltiples.");
      return;
    }
    setLoading(true);
    try {
      const updatedProduct = {
        ...product,
        name,
        price: parseFloat(price),
        description,
        stock: parseInt(stock),
        available,
        popular,
        allergens: allAlergenos.filter((a) => selectedAlergenos.includes(a.id)),
      };

      if (imageFiles[0] || imageFiles[1]) {
        const images = [];
        for (let i = 0; i < 2; i++) {
          if (imageFiles[i]) {
            if (product.images && product.images[i]) {
              const oldImageName = product.images[i].imageUrl;
              const oldPublicId = oldImageName.includes(".")
                ? oldImageName.substring(0, oldImageName.lastIndexOf("."))
                : oldImageName;
              await deleteImageFromCloudinary(oldPublicId);
            }
            const publicId = `product-${name
              .replace(/\s+/g, "-")
              .toLowerCase()}-${Date.now()}-${i}`;
            const signatureData = await getSignature(publicId);
            const imageName = await uploadProductImage(
              imageFiles[i],
              publicId,
              signatureData
            );
            images.push({imageUrl: imageName, order: i});
          } else if (product.images && product.images[i]) {
            images.push(product.images[i]);
          }
        }
        updatedProduct.images = images;
      }

      onSave(updatedProduct);
      onClose();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
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
          Editar Producto
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
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {borderColor: "#8DBB01"},
                  "& fieldset": {borderColor: "#8DBB01"},
                },
                "& .MuiInputLabel-root.Mui-focused": {color: "#8DBB01"},
                "& .MuiInputLabel-root": {
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
              inputProps={{step: "0.01", min: 0, inputMode: "decimal"}}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {borderColor: "#8DBB01"},
                  "& fieldset": {borderColor: "#8DBB01"},
                },
                "& .MuiInputLabel-root.Mui-focused": {color: "#8DBB01"},
              }}
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
              }}
              inputProps={{
                min: 0,
                max: 999,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
            <Box sx={{display: "flex", gap: 3, mb: 2}}>
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
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    sx={{color: "#8DBB01", "&.Mui-checked": {color: "#8DBB01"}}}
                  />
                }
                label="Popular"
              />
            </Box>

            <Typography
              variant="subtitle1"
              sx={{mb: 1, fontWeight: 600, color: "#8DBB01"}}
            >
              Imágenes del producto:
            </Typography>
            <Grid container spacing={2} sx={{mb: 2}}>
              {[0, 1].map((idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 200,
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

            <Typography
              variant="subtitle1"
              sx={{mb: 1, fontWeight: 600, color: "#8DBB01"}}
            >
              Alérgenos:
            </Typography>
            <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mb: 2}}>
              {allAlergenos.map((alergeno) => (
                <Box
                  key={alergeno.id}
                  onClick={() => toggleAlergeno(alergeno.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    border: selectedAlergenos.includes(alergeno.id)
                      ? "2px solid #8DBB01"
                      : "2px solid #e0e0e0",
                    borderRadius: 2,
                    px: 1,
                    py: 0.5,
                    cursor: "pointer",
                    background: selectedAlergenos.includes(alergeno.id)
                      ? "#f4fbe6"
                      : "#fff",
                    transition: "all 0.2s",
                  }}
                >
                  <img
                    src={alergeno.iconUrl}
                    alt={alergeno.name}
                    style={{width: 28, height: 28, objectFit: "contain"}}
                  />
                  <Typography variant="caption">{alergeno.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{px: 3, pb: 2}}>
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
              "Guardar Cambios"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProductModal;
