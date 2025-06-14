import React, {useEffect, useState} from "react";
import {Box, Typography, Link, Container, Divider} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {getContactInfo} from "../service/contactService";
import {useLocation} from "react-router-dom";

const Footer = () => {
  const [bakeryInfo, setBakeryInfo] = useState(null);
  const location = useLocation();
  const isContactPage = location.pathname === "/sobre-nosotros";
  const isReviewPage = location.pathname === "/valoraciones";
  useEffect(() => {
    getContactInfo()
      .then((info) => {
        setBakeryInfo(info);
      })
      .catch(console.error);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#FDF6EC",
        mt: isContactPage ? 0 : isReviewPage ? 0 : 8,
        pt: 4,
        pb: 2,
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: {xs: "column", sm: "row"},
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{fontFamily: "serif", fontWeight: 600}}>
            Panadería Ana
          </Typography>

          <Box sx={{display: "flex", gap: 2}}>
            <Link href="/productos" underline="hover" color="inherit">
              Productos
            </Link>
            <Link href="/sobre-nosotros" underline="hover" color="inherit">
              Sobre Nosotros
            </Link>
            {bakeryInfo?.email ? (
              <Link
                href={`mailto:${bakeryInfo.email}`}
                underline="hover"
                color="inherit"
              >
                Contacto
              </Link>
            ) : (
              <Typography color="text.secondary">Contacto</Typography>
            )}
          </Box>

          <Box sx={{display: "flex", gap: 1}}>
            {bakeryInfo?.facebookUrl && (
              <Link
                href={bakeryInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "transparent",
                  color: "#8B5E3C",
                  "&:hover": {opacity: 0.8},
                }}
              >
                <FacebookIcon />
              </Link>
            )}

            {bakeryInfo?.locationUrl && (
              <Link
                href={bakeryInfo.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Maps"
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "transparent",
                  color: "#8B5E3C",
                  "&:hover": {opacity: 0.8},
                }}
              >
                <LocationOnIcon />
              </Link>
            )}

            {bakeryInfo?.phone && (
              <Link
                href={`tel:${bakeryInfo.phone.replace(/\s+/g, "")}`}
                aria-label="Llamar por teléfono"
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "transparent",
                  color: "#8B5E3C",
                  "&:hover": {opacity: 0.8},
                }}
              >
                <PhoneIcon />
              </Link>
            )}
          </Box>
        </Box>

        <Divider sx={{my: 2}} />

        <Box sx={{textAlign: "center"}}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Panadería Ana. Todos los derechos
            reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
