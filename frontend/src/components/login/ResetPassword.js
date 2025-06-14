import React, {useState} from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Paper,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {baseUrl} from "../../utils/constants";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useSearchParams, useNavigate} from "react-router-dom";

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

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [generalError, setGeneralError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    password: "",
    confirm: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const validate = () => {
    const errors = {};
    if (!password.trim()) {
      errors.password = "La contraseña es obligatoria.";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Debe tener 8 caracteres, mayúsculas, minúsculas, número y símbolo.";
    }

    if (!confirm.trim()) {
      errors.confirm = "Repite la contraseña.";
    } else if (password !== confirm) {
      errors.confirm = "Las contraseñas no coinciden.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccess(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/users/reset-password`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({token, newPassword: password}),
      });
      if (!res.ok) throw new Error();
      setSuccess(
        "Contraseña restablecida correctamente. Ahora puedes iniciar sesión."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      setGeneralError("El enlace es inválido o ha expirado.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Paper sx={{p: 4, maxWidth: 400, width: "100%"}}>
          <Typography variant="h6" color="error">
            Token inválido
          </Typography>
        </Paper>
      </Box>
    );
  }

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
      {/* Fondo desenfocado */}
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
      {/* Capa translúcida */}
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
      {/* Contenido principal */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            maxWidth: 400,
            width: "100%",
            bgcolor: "rgba(255,255,255,0.95)",
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 600,
              fontFamily: "'Playfair Display', serif",
              textAlign: "center",
            }}
          >
            Restablecer contraseña
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nueva contraseña"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              onBlur={validate}
              sx={{mb: 2, ...inputFocusStyle}}
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
              label="Confirmar contraseña"
              type={showConfirm ? "text" : "password"}
              fullWidth
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={!!fieldErrors.confirm}
              helperText={fieldErrors.confirm}
              onBlur={validate}
              sx={{mb: 2, ...inputFocusStyle}}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm((prev) => !prev)}
                      edge="end"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: "#8a8c63",
                color: "#fff",
                px: 6,
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#a0a482",
                },
              }}
            >
              {loading ? "Guardando..." : "Restablecer"}
            </Button>
          </form>

          <Snackbar
            open={!!success}
            autoHideDuration={6000}
            onClose={() => {
              setSuccess(null);
              navigate("/?login=true");
            }}
          >
            <Alert severity="success" sx={{width: "100%"}}>
              {success}
            </Alert>
          </Snackbar>
          <Snackbar
            open={!!generalError}
            autoHideDuration={6000}
            onClose={() => {
              setGeneralError(null);
              navigate("/");
            }}
          >
            <Alert severity="error" sx={{width: "100%"}}>
              {generalError}
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
    </Box>
  );
};

export default ResetPassword;
