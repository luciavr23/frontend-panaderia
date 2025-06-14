import React, {useState, useEffect} from "react";
import {Box, Typography, Button, Slide} from "@mui/material";
import CookiePolicyDialog from "./CookiePolicyDialog";

const CookieBanner = ({onVisibilityChange}) => {
  const [showBanner, setShowBanner] = useState(false);
  const [openPolicy, setOpenPolicy] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    const visible = !consent;
    setShowBanner(visible);
    onVisibilityChange?.(visible);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
    onVisibilityChange?.(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowBanner(false);
    onVisibilityChange?.(false);
  };

  return (
    <>
      <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            bottom: 1,
            width: "100%",
            bgcolor: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
            p: 3,
            zIndex: 1300,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: "#333",
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            Utilizamos cookies para mejorar tu experiencia. Al continuar
            navegando, aceptas nuestra{" "}
            <span
              onClick={() => setOpenPolicy(true)}
              style={{
                color: "#4caf50",
                textDecoration: "underline",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              política de cookies
            </span>
            .
          </Typography>
          <Box sx={{display: "flex", gap: 2, flexWrap: "wrap"}}>
            <Button
              variant="contained"
              color="success"
              size="medium"
              onClick={handleAccept}
              sx={{borderRadius: "12px", px: 3, py: 1}}
            >
              Aceptar
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="medium"
              onClick={handleReject}
              sx={{borderRadius: "12px", px: 3, py: 1}}
            >
              Rechazar
            </Button>
          </Box>
        </Box>
      </Slide>

      <CookiePolicyDialog
        open={openPolicy}
        onClose={() => setOpenPolicy(false)}
      />
    </>
  );
};

export default CookieBanner;
