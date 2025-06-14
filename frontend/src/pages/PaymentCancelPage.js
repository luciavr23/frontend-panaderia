import React from "react";
import {Box, Typography, Button, Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const PaymentCancelPage = () => {
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

      {/* Contenido */}
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
          sx={{
            p: {xs: 3, sm: 5},
            borderRadius: 4,
            maxWidth: 600,
            width: "100%",
            textAlign: "center",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <ErrorOutlineIcon sx={{fontSize: 80, color: "#f44336", mb: 2}} />
          <Typography variant="h4" sx={{mb: 2, fontWeight: "bold"}}>
            Pago Cancelado
          </Typography>
          <Typography variant="body1" sx={{mb: 4}}>
            Lo sentimos, el pago no se ha podido procesar. Por favor, inténtalo
            de nuevo.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "#8DBB01",
              color: "white",
              "&:hover": {
                bgcolor: "#5a774a",
              },
            }}
          >
            Volver al Home
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default PaymentCancelPage;
