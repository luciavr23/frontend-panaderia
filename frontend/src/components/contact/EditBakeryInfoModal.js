import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  CircularProgress,
} from "@mui/material";
import {useState, useEffect} from "react";
import {updateBakeryInfo} from "../../service/contactService";

const EditBakeryInfoModal = ({open, onClose, info, onUpdate}) => {
  const [form, setForm] = useState(info || {});
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    validate();
  }, [form]);

  useEffect(() => {
    setForm(info || {});
    setErrors({});
  }, [info]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm((prev) => ({...prev, [name]: value}));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.street?.trim()) newErrors.street = "La calle es obligatoria";
    if (!form.municipality?.trim())
      newErrors.municipality = "El municipio es obligatorio";
    if (!form.city?.trim()) newErrors.city = "La ciudad es obligatoria";
    if (!form.province?.trim())
      newErrors.province = "La provincia es obligatoria";
    if (!form.postalCode?.trim())
      newErrors.postalCode = "El código postal es obligatorio";
    if (!form.phone?.trim()) newErrors.phone = "El teléfono es obligatorio";
    if (!/^[+0-9\s-]{7,20}$/.test(form.phone))
      newErrors.phone = "Número de teléfono no válido";
    if (!form.email?.trim()) newErrors.email = "El email es obligatorio";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Email no válido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await updateBakeryInfo(info.id, form);
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Error al actualizar la info:", err);
    } finally {
      setLoading(false);
    }
  };

  const textFieldProps = (name, label, type = "text") => ({
    name,
    label,
    type,
    value: form[name] || "",
    onChange: handleChange,
    error: !!errors[name],
    helperText: errors[name] || "",
    fullWidth: true,
    sx: {
      "& label.Mui-focused": {color: "#8DBB01"},
      "& .MuiInput-underline:after": {borderBottomColor: "#8DBB01"},
      "& .MuiOutlinedInput-root": {
        "& fieldset": {borderColor: "#ccc"},
        "&:hover fieldset": {borderColor: "#8DBB01"},
        "&.Mui-focused fieldset": {borderColor: "#8DBB01"},
      },
      "& .MuiInputLabel-root": {
        backgroundColor: "#fefaf1",
        px: 1,
      },
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: {
          p: {xs: 3, sm: 5},
          borderRadius: 4,
          bgcolor: "#fefaf1",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle sx={{px: 0}}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            textAlign: "center",
            color: "#333",
          }}
        >
          Editar información de contacto
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: 4,
          px: 0,
          maxHeight: "65vh",
          mt: 2,
          overflowY: "auto",
        }}
      >
        <Box sx={{display: "flex", flexDirection: "column", gap: 2.5}}>
          <TextField {...textFieldProps("street", "Calle")} />
          <TextField {...textFieldProps("municipality", "Municipio")} />
          <TextField {...textFieldProps("city", "Ciudad")} />
          <TextField {...textFieldProps("province", "Provincia")} />
          <TextField {...textFieldProps("postalCode", "Código Postal")} />
          <TextField {...textFieldProps("phone", "Teléfono")} />
          <TextField {...textFieldProps("email", "Email", "email")} />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 0,
          mt: "auto",
          pt: 3,
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderColor: "#8DBB01",
            color: "#8DBB01",
            "&:hover": {
              bgcolor: "#f5f5f5",
              borderColor: "#5a774a",
              color: "#5a774a",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={Object.keys(errors).length > 0 || loading}
          sx={{
            bgcolor: "#8DBB01",
            color: "white",
            px: 3,
            position: "relative",
            "&:hover": {
              bgcolor: "#5a774a",
            },
            "&.Mui-disabled": {
              bgcolor: "#ccc",
              color: "#666",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{color: "white"}} />
          ) : (
            "Guardar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBakeryInfoModal;
