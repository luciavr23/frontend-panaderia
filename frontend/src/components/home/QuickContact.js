import React, {useEffect, useState} from "react";
import {
  Typography,
  Box,
  Link,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import {getContactInfo} from "../../service/contactService";

function QuickContact() {
  const [info, setInfo] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    getContactInfo().then(setInfo).catch(console.error);
  }, []);

  if (!info) {
    return <Typography>Cargando contacto...</Typography>;
  }

  return (
    <Box sx={{mt: isMobile ? 3 : 7}}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          fontFamily: "'Merriweather', serif",
          mb: 3,
          color: "#333",
          textAlign: isMobile ? "center" : "left",
          mt: isMobile ? 1 : 2,
          fontSize: isMobile ? "1.6rem" : undefined,
        }}
        gutterBottom
      >
        Contáctanos
      </Typography>

      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems="center"
        spacing={1}
        sx={{mb: 1, textAlign: isMobile ? "center" : "left"}}
      >
        <PhoneIcon sx={{color: "#6b8b57"}} />
        <Link
          href={`tel:${info.phone}`}
          sx={{
            color: "#333",
            textDecoration: "underline",
            fontWeight: "500",
            display: isMobile ? "block" : "inline",
          }}
        >
          {info.phone}
        </Link>
      </Stack>

      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems="center"
        spacing={1}
        sx={{textAlign: isMobile ? "center" : "left"}}
      >
        <EmailIcon sx={{color: "#6b8b57"}} />
        <Link
          href={`mailto:${info.email}`}
          sx={{
            color: "#333",
            textDecoration: "underline",
            fontWeight: "500",
            display: isMobile ? "block" : "inline",
          }}
        >
          {info.email}
        </Link>
      </Stack>
    </Box>
  );
}

export default QuickContact;
