import React, {useState} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import {createCategory} from "../../service/categoryService";

import {
  getSignature,
  uploadProductImage,
  CLOUDINARY_BASE_URL,
} from "../../service/cloudinaryService";

const AddCategoryModal = ({open, onClose, onSuccess}) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [nameError, setNameError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value.trim() === "") {
      setNameError("El nombre no puede estar vacío");
    } else {
      setNameError("");
    }
    setName(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      setNameError("El nombre no puede estar vacío");
      return;
    }
    try {
      let imageUrl = "default.jpg";

      if (imageFile) {
        const publicId = `category-${Date.now()}`;

        const signatureData = await getSignature(publicId);

        imageUrl = await uploadProductImage(imageFile, publicId, signatureData);
      }

      await createCategory({
        name: name.trim(),
        description: "",
        imageUrl: imageUrl,
      });

      onSuccess();
      onClose();
      setName("");
      setImageFile(null);
      setPreviewUrl(null);
      setNameError("");
    } catch (error) {
      console.error("Error al crear la categoría:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 3,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              color: "#333",
              textAlign: "center",
            }}
          >
            Añadir Nueva Categoría
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{mt: 2, display: "flex", flexDirection: "column", gap: 3}}>
            <TextField
              label="Nombre de la categoría"
              value={name}
              onChange={handleNameChange}
              fullWidth
              required
              error={!!nameError}
              helperText={nameError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {
                    borderColor: "#8DBB01",
                  },
                  "&:hover fieldset": {
                    borderColor: "#8DBB01",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "'Playfair Display', serif",
                  color: "#333",
                  "&.Mui-focused": {
                    color: "#8DBB01",
                  },
                },
              }}
            />

            <Box sx={{position: "relative", width: "100%", height: 250}}>
              <img
                src={previewUrl || `${CLOUDINARY_BASE_URL}default.jpg`}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  bgcolor: "rgba(255,255,255,0.9)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,1)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <PhotoCamera sx={{color: "#8DBB01"}} />
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{p: 3, pt: 0}}>
          <Button
            onClick={onClose}
            sx={{
              color: "#666",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!!nameError || name.trim() === ""}
            sx={{
              bgcolor: "#8DBB01",
              color: "white",
              px: 4,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#5a774a",
              },
              textTransform: "none",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
            }}
          >
            Crear Categoría
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCategoryModal;
