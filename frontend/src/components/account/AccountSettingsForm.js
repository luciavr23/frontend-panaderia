import React, {useState} from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const customTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8DBB01",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#8DBB01",
          },
        },
      },
    },
  },
});

const AccountSettingsForm = ({user, onSave, loading}) => {
  const [form, setForm] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    password: "",
    newPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  const phoneRegex = /^[0-9]{9}$/;
  const emailRegex =
    /^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*(?:\.(com|net|org|edu|es))$/;

  const validate = (field, value) => {
    const errs = {...errors};
    switch (field) {
      case "name":
        errs.name = !value.trim() ? "El nombre es obligatorio" : "";
        break;
      case "surname":
        errs.surname = !value.trim() ? "Los apellidos son obligatorios" : "";
        break;
      case "email":
        errs.email = !value.trim()
          ? "El email es obligatorio"
          : !emailRegex.test(value)
          ? "Formato de email inválido"
          : "";
        break;
      case "phone":
        errs.phone =
          value && !phoneRegex.test(value)
            ? "Debe tener 9 dígitos numéricos"
            : "";
        break;
      case "password":
        errs.password = !value
          ? "Necesitas tu contraseña actual para guardar"
          : "";
        break;
      case "newPassword":
        errs.newPassword =
          value && !passwordRegex.test(value)
            ? "Debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo"
            : "";
        break;
      default:
        break;
    }
    setErrors(errs);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm({...form, [name]: value});
    validate(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach((field) => {
      switch (field) {
        case "name":
          newErrors.name = !form.name.trim() ? "El nombre es obligatorio" : "";
          break;
        case "surname":
          newErrors.surname = !form.surname.trim()
            ? "Los apellidos son obligatorios"
            : "";
          break;
        case "email":
          newErrors.email = !form.email.trim()
            ? "El email es obligatorio"
            : !emailRegex.test(form.email)
            ? "Formato de email inválido"
            : "";
          break;
        case "phone":
          newErrors.phone =
            form.phone && !phoneRegex.test(form.phone)
              ? "Debe tener 9 dígitos numéricos"
              : "";
          break;
        case "password":
          newErrors.password = !form.password
            ? "Necesitas tu contraseña actual para guardar"
            : "";
          break;
        case "newPassword":
          newErrors.newPassword =
            form.newPassword && !passwordRegex.test(form.newPassword)
              ? "Debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo"
              : "";
          break;
        default:
          break;
      }
    });
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg);
    if (!hasErrors) {
      const userUpdateData = {
        name: form.name,
        surname: form.surname,
        email: form.email,
        phoneNumber: form.phone,
        profileImage: user?.profileImage || null,
        oldPassword: form.password,
        password: form.newPassword || null,
      };

      onSave(userUpdateData);
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{maxWidth: 800, mx: "auto", mt: 5, mb: 5}}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            bgcolor: "#fff",
            borderRadius: 4,
            border: "1px solid #eee",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: {xs: "2rem", sm: "2.5rem", md: "2rem"},
              lineHeight: 1.2,
              letterSpacing: "-1px",
              textAlign: "center",
              color: "#333",
              mb: 4,
            }}
          >
            Configuración de Mi Cuenta
          </Typography>

          <TextField
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label="Apellidos"
            name="surname"
            value={form.surname}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.surname}
            helperText={errors.surname}
          />

          <TextField
            label="Correo electrónico"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Teléfono"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.phone}
            helperText={errors.phone}
          />

          <TextField
            label="Contraseña actual"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Nueva contraseña"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={form.newPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loading={loading}
            sx={{
              mt: 4,
              py: 1.3,
              fontWeight: 700,
              backgroundColor: "#8DBB01",
              "&:hover": {backgroundColor: "#6e9900"},
            }}
          >
            Guardar cambios
          </LoadingButton>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default AccountSettingsForm;
