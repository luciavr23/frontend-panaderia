import React, {useEffect, useState, useContext} from "react";

import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";
import {AuthContext} from "../../context/AuthContext";
import {getAdminStats} from "../../service/adminService";

const StatCard = ({title, value, icon, color, subtitle}) => (
  <Paper
    sx={{
      p: 3,
      height: "100%",
      borderRadius: 2,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      transition: "transform 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
      },
    }}
  >
    <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
      <Box
        sx={{
          bgcolor: `${color}15`,
          p: 1,
          borderRadius: 2,
          mr: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{color: "text.secondary"}}>
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" sx={{fontWeight: 600, mb: 1}}>
      {value}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Paper>
);

const ProgressCard = ({title, value, total, color}) => (
  <Paper
    sx={{
      p: 3,
      height: "100%",
      borderRadius: 2,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <Typography variant="h6" sx={{mb: 2, color: "text.secondary"}}>
      {title}
    </Typography>
    <Box sx={{mb: 1}}>
      <Typography variant="h4" sx={{fontWeight: 600}}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        de {total} pedidos
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={total === 0 ? 0 : (value / total) * 100}
      sx={{
        height: 8,
        borderRadius: 4,
        bgcolor: `${color}15`,
        "& .MuiLinearProgress-bar": {
          bgcolor: color,
        },
      }}
    />
  </Paper>
);

const AdminStats = () => {
  const theme = useTheme();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {auth} = useContext(AuthContext);
  const token = auth?.token;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getAdminStats(token);
        setStats(data);
      } catch (err) {
        setError("Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(254, 250, 243, 0.85)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(2px)",
        }}
      >
        <Box
          sx={{
            border: "6px solid #cce5b1",
            borderTop: "6px solid #8DBB01",
            borderRadius: "50%",
            width: 60,
            height: 60,
            animation: "spin 1s linear infinite",
          }}
        />
        <style>
          {`@keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }`}
        </style>
      </Box>
    );
  }

  if (error) {
    return <Box sx={{color: "red", textAlign: "center", mt: 4}}>{error}</Box>;
  }
  if (!stats) return null;

  const {
    totalOrders = 0,
    totalRevenue = 0,
    ordersByStatus = {},
    avgPreparationTime = 0,
    growth = {},
  } = stats;

  return (
    <Box sx={{width: "100%", m: 0, p: 0, mb: 4}}>
      <Typography variant="h5" sx={{mb: 3, fontWeight: 600, color: "#333"}}>
        Estadísticas mensuales
      </Typography>

      {/* Primera fila: Estadísticas principales */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Pedidos Totales"
            value={totalOrders}
            icon={<CartIcon sx={{color: "#8DBB01", fontSize: 28}} />}
            color="#8DBB01"
            subtitle="Este mes"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Ingresos"
            value={`${totalRevenue.toFixed(2)}€`}
            icon={<MoneyIcon sx={{color: "#2196f3", fontSize: 28}} />}
            color="#2196f3"
            subtitle="Este mes"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Tiempo Promedio"
            value={avgPreparationTime ? `${avgPreparationTime} min` : "-"}
            icon={<TimerIcon sx={{color: "#ff9800", fontSize: 28}} />}
            color="#ff9800"
            subtitle="Por pedido"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Crecimiento"
            value={
              typeof growth.orders === "number"
                ? `${growth.orders > 0 ? "+" : ""}${growth.orders.toFixed(0)}%`
                : "-"
            }
            icon={<TrendingUpIcon sx={{color: "#4caf50", fontSize: 28}} />}
            color="#4caf50"
            subtitle="vs mes anterior"
          />
        </Grid>
      </Grid>

      {/* Segunda fila: Estados de pedidos */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ProgressCard
            title="En Preparación"
            value={ordersByStatus["EN_PREPARACION"] || 0}
            total={totalOrders}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProgressCard
            title="Listos"
            value={ordersByStatus.LISTO || 0}
            total={totalOrders}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProgressCard
            title="Cancelados"
            value={ordersByStatus.CANCELADO || 0}
            total={totalOrders}
            color="#757575"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStats;
