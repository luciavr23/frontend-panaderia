import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import heroVideo from "../../assets/videos/heroVideo.mp4";
import heroPoster from "../../assets/images/heroPoster.png";
import {useNavigate} from "react-router-dom";

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        height: {xs: "60vh", md: "80vh"},
        overflow: "hidden",
      }}
    >
      {/* Video de fondo */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={heroPoster}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
        }}
      >
        <source src={heroVideo} type="video/mp4" />
        Tu navegador no soporta video en HTML5.
      </Box>

      {/* Capa beige translúcida */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(rgba(245, 235, 220, 0.25), rgba(245, 235, 220, 0.7))",
          zIndex: 2,
        }}
      />

      {/* Contenido (texto e imagen) */}
      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          alignItems: "center",
          px: {xs: 3, md: 6},
        }}
      >
        <Grid container spacing={{xs: 4, md: 12}} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: {xs: "2rem", sm: "2.5rem", md: "3.8rem"},
                lineHeight: 1.2,
                letterSpacing: "-1px",
                textAlign: {xs: "center", md: "left"},
                mb: {xs: 3, md: 0},
              }}
            >
              Repostería <br />
              y Comida <br />
              Casera
            </Typography>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: {xs: "center", md: "flex-start"},
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/productos")}
                sx={{
                  backgroundColor: "#8DBB01",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                  "&:hover": {
                    backgroundColor: "#5a774a",
                  },
                }}
              >
                HAZ TU PEDIDO
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HeroSection;
