import React from "react";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
} from "@mui/icons-material";

const OrderFilter = ({filter, onFilterChange, orderCounts, badgesVisibles}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{mb: 3}}>
      <Typography
        variant="subtitle1"
        sx={{mb: 2, fontWeight: 600, color: "#333"}}
      >
        Filtrar por estado
      </Typography>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(e, newFilter) => newFilter && onFilterChange(newFilter)}
        aria-label="filtro de pedidos"
        sx={{
          "& .MuiToggleButton-root": {
            border: "1px solid #e0e0e0",
            borderRadius: "8px !important",
            margin: "0 4px",
            px: 2,
            py: 1,
            "&.Mui-selected": {
              bgcolor: "#8DBB01",
              color: "white",
              "&:hover": {
                bgcolor: "#7aa300",
              },
            },
          },
        }}
      >
        <ToggleButton value="EN_PREPARACION">
          <Badge
            badgeContent={
              badgesVisibles?.EN_PREPARACION
                ? orderCounts?.EN_PREPARACION || 0
                : null
            }
            color="warning"
            sx={{"& .MuiBadge-badge": {fontSize: "0.8rem"}}}
          >
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <ShippingIcon />
              {!isMobile && <Typography>En preparación</Typography>}
            </Box>
          </Badge>
        </ToggleButton>

        <ToggleButton value="LISTO">
          <Badge
            badgeContent={
              badgesVisibles?.LISTO ? orderCounts?.LISTO || 0 : null
            }
            color="success"
            sx={{"& .MuiBadge-badge": {fontSize: "0.8rem"}}}
          >
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <CheckCircleIcon />
              {!isMobile && <Typography>Completados</Typography>}
            </Box>
          </Badge>
        </ToggleButton>

        <ToggleButton value="CANCELADO">
          <Badge
            badgeContent={
              badgesVisibles?.CANCELADO ? orderCounts?.CANCELADO || 0 : null
            }
            color="error"
            sx={{"& .MuiBadge-badge": {fontSize: "0.8rem"}}}
          >
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <PendingIcon />
              {!isMobile && <Typography>Cancelados</Typography>}
            </Box>
          </Badge>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default OrderFilter;
