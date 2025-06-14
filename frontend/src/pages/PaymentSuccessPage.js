import React from "react";
import {Box, Typography, Paper, Button} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {useNavigate} from "react-router-dom";

const PaymentSuccessPage = ({email}) => {
  const navigate = useNavigate();

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

      {/* ✅ Contenido */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          position: "relative",
          zIndex: 2,
          px: {xs: 2, sm: 4},
        }}
      >
        <Paper
          sx={{
            p: {xs: 2, sm: 4, md: 5},
            borderRadius: 4,
            maxWidth: {xs: "100%", sm: 500, md: 600},
            width: "100%",
            textAlign: "center",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: {xs: 50, sm: 70, md: 80},
              color: "success.main",
              mb: 2,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontFamily: "serif",
              mb: 2,
              fontSize: {xs: "2rem", sm: "2.5rem", md: "3rem"},
            }}
          >
            Pago realizado con éxito
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              fontSize: {xs: "1rem", sm: "1.1rem"},
              wordBreak: "break-word",
            }}
          >
            Hemos enviado un correo de confirmación del pedido a{" "}
            <b>{email || "tu email"}</b>.<br />
            Consérvelo, este será su ticket.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/mi-cuenta")}
            sx={{
              mt: 2,
              backgroundColor: "#8DBB01",
              "&:hover": {
                backgroundColor: "#5a774a",
              },
              fontSize: {xs: "1rem", sm: "1.1rem"},
              py: {xs: 1, sm: 1.5},
              px: {xs: 2, sm: 4},
              width: {xs: "100%", sm: "auto"},
            }}
            fullWidth={{xs: true, sm: false}}
          >
            Ir a mi cuenta
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default PaymentSuccessPage;
