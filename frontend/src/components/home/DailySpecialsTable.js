import React, {useEffect, useState} from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {getDailySpecials} from "../../service/dailySpecialService";

const DailySpecialsTable = () => {
  const [specials, setSpecials] = useState([]);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isCompact = isTablet || isMobile;

  useEffect(() => {
    getDailySpecials().then(setSpecials).catch(console.error);
  }, []);

  const todayName = new Date().toLocaleDateString("es-ES", {weekday: "long"});

  const toTitleCase = (str) =>
    str.toLowerCase().replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());

  const weekOrder = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

  const sortedSpecials = [...specials].sort((a, b) => {
    const aIndex = weekOrder.indexOf(a.weekday.toLowerCase());
    const bIndex = weekOrder.indexOf(b.weekday.toLowerCase());
    return aIndex - bIndex;
  });

  if (specials.length === 0) return null;

  return (
    <Box sx={{width: "100%"}}>
      <Box sx={{maxWidth: 600}}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontFamily: "'Merriweather', serif",
            mb: 3,
            color: "#333",
            textAlign: isCompact ? "center" : "left",
            mt: isCompact ? 5 : 9,
            fontSize: isCompact ? "1.6rem" : undefined,
          }}
          gutterBottom
        >
          Guisos del día
        </Typography>

        {!isCompact ? (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              mt: 3,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f5f5f5",
                      color: "#333",
                    }}
                  >
                    Producto
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f5f5f5",
                      color: "#333",
                    }}
                  >
                    Día
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedSpecials.map((item) => {
                  const isToday =
                    item.weekday.toLowerCase() === todayName.toLowerCase();
                  return (
                    <TableRow
                      key={item.id}
                      hover
                      sx={
                        isToday ? {backgroundColor: "#cce3b6 !important"} : {}
                      }
                    >
                      <TableCell sx={{color: "#333"}}>
                        {item.productName}
                      </TableCell>
                      <TableCell sx={{color: "#333"}}>
                        {toTitleCase(item.weekday)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 1 : isTablet ? 2 : 3,
            }}
          >
            {sortedSpecials.map((item) => {
              const isToday =
                item.weekday.toLowerCase() === todayName.toLowerCase();

              return (
                <Card
                  key={item.id}
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    backgroundColor: isToday ? "#cce3b6" : "#fff",
                    px: isMobile ? 1 : isTablet ? 2 : 3,
                    py: isMobile ? 0.5 : isTablet ? 1.5 : 2,
                    width: isMobile ? "90%" : isTablet ? "100%" : "100%",
                    mx: isMobile || isTablet ? "auto" : undefined,
                  }}
                >
                  <CardContent
                    sx={{
                      py: isMobile ? 0.5 : isTablet ? 1.5 : 2,
                      "&:last-child": {pb: isMobile ? 0.5 : isTablet ? 1.5 : 2},
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                        fontSize: isMobile
                          ? "0.85rem"
                          : isTablet
                          ? "0.95rem"
                          : "1rem",
                      }}
                    >
                      {item.productName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: isMobile
                          ? "0.7rem"
                          : isTablet
                          ? "0.8rem"
                          : "0.9rem",
                      }}
                    >
                      {toTitleCase(item.weekday)}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DailySpecialsTable;
