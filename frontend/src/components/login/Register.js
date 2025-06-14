import React, {useState, useEffect} from "react";
import {useMediaQuery, useTheme} from "@mui/material";

import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Grid,
  Button,
  Link,
  IconButton,
  InputAdornment,
  Alert as MuiAlert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import logo from "../../assets/logos/2.png";

const inputFocusStyle = {
  "& .MuiOutlinedInput-root.Mui-focused": {
    "& fieldset": {borderColor: "#8DBB01"},
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#8DBB01",
  },
  "& .MuiOutlinedInput-root.Mui-error fieldset": {
    borderColor: "#d32f2f",
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: "#d32f2f",
  },
};

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    phone: "",
    showPassword: false,
    showConfirm: false,
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const validateField = (name, value) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    const phoneRegex = /^(?!([0-9])\1{8}$)[0-9]{9}$/;
    const emailRegex =
      /^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*(?:\.(com|net|org|edu|es))$/;

    const fieldErrors = {};

    switch (name) {
      case "name":
        fieldErrors.name = !value.trim() ? "El nombre es obligatorio." : "";
        break;

      case "email":
        if (!value.trim()) fieldErrors.email = "El email es obligatorio.";
        else if (!emailRegex.test(value))
          fieldErrors.email = "Introduce un email válido.";
        else fieldErrors.email = "";
        break;

      case "password":
        if (!value.trim())
          fieldErrors.password = "La contraseña es obligatoria.";
        else if (!passwordRegex.test(value))
          fieldErrors.password =
            "Debe tener 8 caracteres, mayúsculas, minúsculas, número y símbolo.";
        else fieldErrors.password = "";
        break;

      case "confirmPassword":
        if (!value.trim())
          fieldErrors.confirmPassword = "Repite la contraseña.";
        else if (value !== formData.password)
          fieldErrors.confirmPassword = "Las contraseñas no coinciden.";
        else fieldErrors.confirmPassword = "";
        break;

      case "phone":
        const cleanPhone = value.trim();
        fieldErrors.phone =
          cleanPhone && !phoneRegex.test(cleanPhone)
            ? "El teléfono debe tener 9 dígitos."
            : "";
        break;

      default:
        break;
    }

    return fieldErrors;
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));

    const newFieldErrors = validateField(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newFieldErrors,
    }));
  };

  const toggleVisibility = (field) => () => {
    setFormData((prev) => ({...prev, [field]: !prev[field]}));
  };

  useEffect(() => {
    const noErrors = Object.values(errors).every((e) => !e);
    const filledFields =
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.name;
    setIsFormValid(
      noErrors && filledFields && formData.password === formData.confirmPassword
    );
  }, [errors, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    const validationErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        ["email", "password", "confirmPassword", "name", "phone"].includes(key)
      ) {
        Object.assign(validationErrors, validateField(key, formData[key]));
      }
    });

    if (Object.values(validationErrors).some((v) => v)) return;

    const cleanPhone = formData.phone.trim() || null;

    try {
      const response = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email.trim(),
          password: formData.password,
          phoneNumber: cleanPhone,
          role: "CLIENT",
        }),
      });

      if (response.ok) {
        navigate("/?login=true", {state: {fromRegister: true}});
      } else {
        const data = await response.json();
        const backendErrors = {};
        const errorList = Array.isArray(data.errors)
          ? data.errors
          : [data.message || "Error desconocido"];

        errorList.forEach((err) => {
          const normalized = err
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          if (normalized.includes("email")) backendErrors.email = err;
          else if (normalized.includes("telefono")) backendErrors.phone = err;
          else backendErrors.general = err;
        });

        setErrors((prev) => ({...prev, ...backendErrors}));
        if (backendErrors.general) setAuthError(backendErrors.general);
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      setAuthError("Error de servidor, verifica que no estés registrado.");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <HomeIcon
        sx={{
          position: "fixed",
          top: 10,
          left: 20,
          fontSize: {xs: 30, md: 40},
          color: "#8DBB01",
          cursor: "pointer",
          zIndex: 5,
        }}
        onClick={() => navigate("/")}
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/fondos/fondoPanaderia.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px)",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(253, 246, 236, 0.85)",
          zIndex: 1,
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          alignItems: "flex-center",
          justifyContent: "center",
          minHeight: {xs: "100vh", md: "calc(100vh - 120px)"},
          pt: {xs: 6, md: 10},
          pb: {xs: 6, md: 10},
          zIndex: 2,
          position: "relative",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: 500,
            p: {xs: 3, md: 5},
            bgcolor: "rgba(255,255,255,0.95)",
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            position: "relative",
          }}
        >
          {isMobile ? (
            <Box sx={{display: "flex", justifyContent: "center", mb: 2}}>
              <Box
                component="img"
                src={logo}
                alt="Panadería Ana"
                sx={{height: 100}}
              />
            </Box>
          ) : (
            <Box sx={{position: "absolute", top: "-20px", right: 24}}>
              <img src={logo} alt="Panadería Ana" style={{height: 140}} />
            </Box>
          )}

          <Typography
            variant="h4"
            align="center"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              mb: 4,
              color: "#333",
            }}
          >
            Registro
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <TextField
                  label="Nombre"
                  required
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={inputFocusStyle}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Apellido"
                  name="surname"
                  fullWidth
                  value={formData.surname}
                  onChange={handleChange}
                  sx={inputFocusStyle}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Email"
                  required
                  name="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={inputFocusStyle}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="tel"
                  label="Teléfono"
                  name="phone"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "").slice(0, 9);
                    setFormData((prev) => ({...prev, phone: value}));

                    const phoneRegex = /^(?!([0-9])\1{8}$)[0-9]{9}$/;
                    let error = "";
                    if (value.length === 9 && !phoneRegex.test(value)) {
                      error = "Teléfono no válido.";
                    } else if (value && value.length < 9) {
                      error = "";
                    }
                    setErrors((prev) => ({
                      ...prev,
                      phone: error,
                    }));
                  }}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  sx={inputFocusStyle}
                  inputProps={{
                    maxLength: 9,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    const phoneRegex = /^(?!([0-9])\1{8}$)[0-9]{9}$/;
                    let error = "";
                    if (
                      value &&
                      (!phoneRegex.test(value) || value.length !== 9)
                    ) {
                      error = "Teléfono no válido.";
                    }
                    setErrors((prev) => ({
                      ...prev,
                      phone: error,
                    }));
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Contraseña"
                  required
                  name="password"
                  type={formData.showPassword ? "text" : "password"}
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={inputFocusStyle}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleVisibility("showPassword")}
                          edge="end"
                        >
                          {formData.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Repita Contraseña"
                  required
                  name="confirmPassword"
                  type={formData.showConfirm ? "text" : "password"}
                  fullWidth
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={inputFocusStyle}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleVisibility("showConfirm")}
                          edge="end"
                        >
                          {formData.showConfirm ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!isFormValid}
                    sx={{
                      backgroundColor: isFormValid ? "#8a8c63" : "#ccc",
                      color: "#fff",
                      px: 6,
                      py: 1.8,
                      fontWeight: "bold",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: isFormValid ? "#a0a482" : "#ccc",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Registrarme
                  </Button>
                </Box>

                {authError && (
                  <Box sx={{mt: 2}}>
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{textAlign: "center"}}
                    >
                      {authError}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>

          <Box sx={{textAlign: "center", mt: 1}}>
            <Typography variant="body2" sx={{color: "text.secondary"}}>
              ¿Ya tienes cuenta?{" "}
              <Link
                component="button"
                onClick={() => navigate("/?login=true")}
                sx={{
                  color: "#8a8c63",
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&:hover": {textDecoration: "underline"},
                }}
              >
                Inicia sesión
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
