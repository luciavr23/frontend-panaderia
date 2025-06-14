import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CookiePolicyDialog = ({open, onClose}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      scroll="paper"
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{fontWeight: 600, fontFamily: "serif", color: "#333"}}>
        Política de Cookies
      </DialogTitle>

      <DialogContent dividers sx={{px: 3, py: 2}}>
        <Typography variant="h6" sx={{color: "#333", fontWeight: 600, mb: 1}}>
          ¿Qué son las cookies?
        </Typography>
        <Typography paragraph sx={{color: "#444"}}>
          Las cookies son pequeños archivos que se descargan en tu dispositivo
          al navegar por sitios web. Nos ayudan a mejorar tu experiencia y a
          recordar tus preferencias.
        </Typography>

        <Typography variant="h6" sx={{color: "#333", fontWeight: 600, mb: 1}}>
          ¿Cómo usamos las cookies?
        </Typography>
        <Typography paragraph sx={{color: "#444"}}>
          Utilizamos cookies para gestionar sesiones, recordar tus preferencias,
          y analizar el uso de la web. Algunas cookies son esenciales para el
          funcionamiento correcto del sitio.
        </Typography>

        <Typography variant="h6" sx={{color: "#333", fontWeight: 600, mb: 1}}>
          ¿Cómo desactivar las cookies?
        </Typography>
        <Typography paragraph sx={{color: "#444"}}>
          Puedes configurar tu navegador para bloquear o eliminar cookies. Sin
          embargo, esto puede afectar al funcionamiento de la web y limitar
          ciertas funcionalidades.
        </Typography>

        <Typography variant="h6" sx={{color: "#333", fontWeight: 600, mb: 1}}>
          Cookies de terceros
        </Typography>
        <Typography paragraph sx={{color: "#444"}}>
          Utilizamos servicios de análisis (como Google Analytics) que pueden
          establecer sus propias cookies para medir el uso del sitio y mejorar
          el contenido.
        </Typography>

        <Typography variant="h6" sx={{color: "#333", fontWeight: 600, mb: 1}}>
          Más información
        </Typography>
        <Typography paragraph sx={{color: "#444"}}>
          Para más detalles sobre nuestra política de cookies, puedes contactar
          con nosotros en{" "}
          <a
            href="mailto:correo@panaderia.com"
            style={{
              color: "#333",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            correo@panaderia.com
          </a>
          .
        </Typography>
      </DialogContent>

      <DialogActions sx={{justifyContent: "flex-start", px: 3, py: 2}}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#6b8b57",
            color: "#fff",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {backgroundColor: "#5a764b"},
          }}
          startIcon={<ArrowBackIcon />}
        >
          Volver
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CookiePolicyDialog;
