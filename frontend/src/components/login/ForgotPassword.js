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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {baseUrl} from "../../utils/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router-dom";

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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${baseUrl}/users/forgot-password`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email}),
      });
      if (!res.ok) throw new Error("No se pudo enviar el email");
      setSuccess("Si el email existe, se ha enviado un enlace de recuperación");
    } catch (e) {
      setError("Error al enviar el email de recuperación");
    } finally {
      setLoading(false);
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
      {/* 🔙 Botón de volver */}
      <ArrowBackIcon
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

      {/* 🎨 Fondo desenfocado */}
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
      {/* 🧥 Capa translúcida */}
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

      {/* 🧾 Contenido principal */}
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
            Recuperar contraseña
          </Typography>
          <Typography variant="body2" sx={{mb: 2, textAlign: "center"}}>
            Ingresa tu email y te enviaremos un enlace para restablecer tu
            contraseña.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{mb: 2, ...inputFocusStyle}}
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
              {loading ? "Enviando..." : "Enviar enlace"}
            </Button>
          </form>

          <Snackbar
            open={!!success}
            autoHideDuration={6000}
            onClose={() => setSuccess(null)}
          >
            <Alert severity="success" sx={{width: "100%"}}>
              {success}
            </Alert>
          </Snackbar>
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError(null)}
          >
            <Alert severity="error" sx={{width: "100%"}}>
              {error}
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
