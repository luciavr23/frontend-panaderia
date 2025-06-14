import React, {useState} from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import {useNavigate} from "react-router-dom";
import {updateCategory, deleteCategory} from "../../service/categoryService";
import {
  uploadProductImage,
  getSignature,
  deleteImageFromCloudinary,
} from "../../service/cloudinaryService";
import {CLOUDINARY_BASE_URL} from "../../service/cloudinaryService";
import ConfirmDialog from "../dialogs/ConfirmDialog";

const CategoryCard = ({category, isAdmin, refreshCategories}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (category.imageUrl && category.imageUrl !== "default.jpg") {
      const oldImageName = category.imageUrl;
      const oldPublicId = oldImageName.includes(".")
        ? oldImageName.substring(0, oldImageName.lastIndexOf("."))
        : oldImageName;
      await deleteImageFromCloudinary(oldPublicId);
    }

    const publicId = `category-${category.id}-${Date.now()}`;
    const signatureData = await getSignature(publicId);
    const imageName = await uploadProductImage(file, publicId, signatureData);

    await updateCategory(category.id, {
      ...category,
      imageUrl: imageName,
    });

    refreshCategories();
  };

  const handleSaveName = async () => {
    setIsEditing(false);
    if (!name.trim()) return;

    await updateCategory(category.id, {
      ...category,
      name: name.trim(),
    });

    refreshCategories();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCategory(category.id);
      refreshCategories();
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const handleViewCategory = () => {
    navigate(`/productos/categoria/${category.id}`);
  };

  return (
    <Card
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      <Box sx={{position: "relative", height: 220}}>
        <CardMedia
          component="img"
          image={`${CLOUDINARY_BASE_URL}/${category.imageUrl}`}
          alt={category.name}
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            filter: isAdmin ? "grayscale(60%) brightness(0.8)" : "none",
            transition: "filter 0.3s ease",
          }}
        />

        {isAdmin && (
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "rgba(255,255,255,0.8)",
              borderRadius: "50%",
              p: 1,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
              zIndex: 2,
            }}
          >
            <PhotoCamera />
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </IconButton>
        )}
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box>
          {isAdmin && isEditing ? (
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                handleSaveName().catch(console.error);
              }}
              size="small"
              variant="outlined"
              fullWidth
              sx={{mb: 2}}
            />
          ) : (
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                textAlign: "center",
                mb: 2,
                minHeight: "2.5em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {name}
            </Typography>
          )}
        </Box>

        <Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleViewCategory}
            sx={{
              bgcolor: "#8DBB01",
              borderRadius: 2,
              color: "white",
              fontWeight: "bold",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
              textTransform: "none",
              mb: isAdmin ? 1 : 0,
              "&:hover": {
                bgcolor: "#5a774a",
              },
            }}
          >
            Ver categoría
          </Button>

          {isAdmin && (
            <Box display="flex" justifyContent="flex-end" gap={1} sx={{mt: 1}}>
              <IconButton
                onClick={() => setIsEditing(!isEditing)}
                sx={{
                  color: "#8DBB01",
                  "&:hover": {
                    color: "#5a774a",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => setConfirmOpen(true)}
                sx={{
                  color: "#d32f2f",
                  "&:hover": {
                    color: "#b71c1c",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar categoría"
        message={`¿Estás seguro que quieres eliminar la categoría "${category.name}"? Esta acción no es reversible.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColor="error"
        loading={deleting}
      />
    </Card>
  );
};

export default CategoryCard;
