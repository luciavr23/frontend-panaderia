import React, {useEffect, useState, useContext} from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Badge,
  IconButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Pagination,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import {useSearchParams} from "react-router-dom";
import AdminSidebar from "../components/account/AdminSidebar";
import OrderDetails from "../components/account/OrderDetails";
import OrderFilter from "../components/account/OrderFilter";
import AdminSettings from "../components/account/AdminSettings";
import AdminStats from "../components/account/AdminStats";
import {AuthContext} from "../context/AuthContext";
import {getTodayOrders} from "../service/orderService";
import {getAdminStats} from "../service/adminService";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import NotificationsModal from "../components/notifications/NotificationsModal";
import {webSocketService} from "../service/WebSocketService";

const ITEMS_PER_PAGE = 6;
const statusLabels = {
  EN_PREPARACION: "en preparación",
  LISTO: "completado",
  CANCELADO: "cancelado",
  PREPARACION: "en preparación",
  COMPLETADO: "completado",
};
const AdminAccountPage = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [notification, setNotification] = useState(null);
  const [statusFilter, setStatusFilter] = useState("EN_PREPARACION");
  const [badgesVisibles, setBadgesVisibles] = useState({
    EN_PREPARACION: true,
    LISTO: true,
    CANCELADO: true,
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsType, setSettingsType] = useState(null);
  const [page, setPage] = useState(1);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {auth} = useContext(AuthContext);
  const token = auth?.token;
  const prevIdsRef = React.useRef([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).getDay();
  const today = new Date().getDate();

  const calendarDays = Array.from({length: firstDayOfMonth}, () => null).concat(
    Array.from({length: daysInMonth}, (_, i) => i + 1)
  );

  const fetchOrders = async () => {
    try {
      const data = await getTodayOrders(token);
      setOrders(data);
    } catch (e) {
      console.error("Error al obtener pedidos de hoy:", e);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getAdminStats(token);
      setStats(data);
    } catch (e) {
      console.error("Error al obtener estadísticas", e);
    }
  };
  const handleFilterChange = (newFilter) => {
    if (!newFilter) return;
    setStatusFilter(newFilter);
    setBadgesVisibles((prev) => ({...prev, [newFilter]: false}));
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!tab) {
      setSelectedTab("dashboard");
    } else if (["dashboard", "orders", "stats"].includes(tab)) {
      setSelectedTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await getTodayOrders(token);
        const nuevos = data.filter((o) => !prevIdsRef.current.includes(o.id));
        if (nuevos.length > 0) {
          setNotification({
            message: `¡Nuevo pedido #${nuevos[0].id} recibido!`,
            severity: "success",
          });
          setOrders(data);
        }
        await fetchStats();
      } catch (e) {
        console.error("Error al actualizar pedidos automáticamente", e);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    prevIdsRef.current = orders.map((o) => o.id);
  }, [orders]);

  useEffect(() => {
    const handleNewOrder = (order) => {
      setNotifications((prev) => [order, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setOrders((prevOrders) => {
        const newOrders = [...prevOrders];
        const index = newOrders.findIndex((o) => o.id === order.id);
        if (index === -1) {
          newOrders.unshift(order);
        } else {
          newOrders[index] = order;
        }
        return newOrders;
      });
    };

    webSocketService.connect();

    webSocketService.addSubscriber("new-order", handleNewOrder);

    return () => {
      webSocketService.removeSubscriber("new-order", handleNewOrder);
      webSocketService.disconnect();
    };
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((orders) =>
      orders.map((order) =>
        order.id === orderId ? {...order, status: newStatus} : order
      )
    );
    setNotification({
      message: `Pedido #${orderId} ${newStatus.toLowerCase()}`,
      severity: "info",
    });
  };
  const filteredOrders = orders.filter(
    (order) =>
      (order.id.toString().includes(searchTerm) ||
        (order.clientName?.toLowerCase() ?? "").includes(
          searchTerm.toLowerCase()
        )) &&
      (!statusFilter || order.status === statusFilter)
  );

  let sortedOrders = [...filteredOrders];

  if (statusFilter === "EN_PREPARACION") {
    sortedOrders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
  } else {
    sortedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }

  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = sortedOrders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleSettingsSelect = (type) => {
    setSettingsType(type);
    setSettingsOpen(true);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setUnreadCount(0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const renderCalendarDays = () => {
    if (isMobile) {
      return (
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            p: 1.5,
            backgroundColor: "#8DBB01",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            minWidth: 110,
            minHeight: 120,
            wordWrap: "break-word",
            overflow: "hidden",
            boxShadow: "0 0 0 2px #8DBB01",
          }}
        >
          <Typography fontWeight="bold" sx={{fontSize: "1rem", mb: 1}}>
            Día {today}
          </Typography>
          <Box sx={{fontSize: "0.95rem", lineHeight: 1.4}}>
            <Typography sx={{display: "flex", alignItems: "center", gap: 1}}>
              Totales:{" "}
              <span style={{fontWeight: 700}}>
                {stats?.totalOrdersToday ?? "-"}
              </span>
            </Typography>
            <Typography sx={{display: "flex", alignItems: "center", gap: 1}}>
              Completados:{" "}
              <span style={{fontWeight: 700}}>
                {stats?.completedOrdersToday ?? "-"}
              </span>
            </Typography>
            <Typography sx={{display: "flex", alignItems: "center", gap: 1}}>
              Pendientes:{" "}
              <span style={{fontWeight: 700}}>
                {stats?.pendingOrdersToday ?? "-"}
              </span>
            </Typography>
          </Box>
        </Paper>
      );
    }

    return calendarDays.map((day, index) => (
      <Paper
        key={index}
        elevation={3}
        sx={{
          borderRadius: 2,
          p: 1.5,
          backgroundColor: day === today ? "#8DBB01" : "#fff",
          color: day === today ? "white" : "black",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          minWidth: {xs: 80, sm: 90, md: 110},
          minHeight: 100,
          wordWrap: "break-word",
          overflow: "hidden",
          boxShadow: day === today ? "0 0 0 2px #8DBB01" : undefined,
        }}
      >
        {day ? (
          <>
            <Typography fontWeight="bold" sx={{fontSize: "1rem", mb: 1}}>
              Día {day}
            </Typography>
            {day === today && (
              <Box sx={{fontSize: "0.95rem", lineHeight: 1.4}}>
                <Typography
                  sx={{display: "flex", alignItems: "center", gap: 1}}
                >
                  Totales:{" "}
                  <span style={{fontWeight: 700}}>
                    {stats?.totalOrdersToday ?? "-"}
                  </span>
                </Typography>
                <Typography
                  sx={{display: "flex", alignItems: "center", gap: 1}}
                >
                  Completados:{" "}
                  <span style={{fontWeight: 700}}>
                    {stats?.completedOrdersToday ?? "-"}
                  </span>
                </Typography>
                <Typography
                  sx={{display: "flex", alignItems: "center", gap: 1}}
                >
                  Pendientes:{" "}
                  <span style={{fontWeight: 700}}>
                    {stats?.pendingOrdersToday ?? "-"}
                  </span>
                </Typography>
              </Box>
            )}
          </>
        ) : null}
      </Paper>
    ));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress sx={{color: "#8DBB01"}} />
        </Box>
      );
    }

    switch (selectedTab) {
      case "stats":
        return (
          <Box sx={{width: "100%", p: 0}}>
            <AdminStats orders={orders} />
          </Box>
        );
      case "orders":
        return (
          <>
            <OrderFilter
              filter={statusFilter}
              onFilterChange={handleFilterChange}
              orderCounts={orders.reduce((acc, order) => {
                acc[order.status] = (acc[order.status] || 0) + 1;
                return acc;
              }, {})}
              badgesVisibles={badgesVisibles}
            />

            {filteredOrders.length === 0 ? (
              <Box sx={{mt: 4, textAlign: "center", width: "100%"}}>
                <Typography variant="body1" color="text.secondary">
                  No hay ningún pedido{" "}
                  {statusLabels[statusFilter] || "disponible"}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3} sx={{width: "100%", margin: 0}}>
                {paginatedOrders.map((order) => (
                  <Grid item xs={12} sm={6} md={6} key={order.id}>
                    <OrderDetails order={order} onOrderUpdated={fetchOrders} />
                  </Grid>
                ))}
              </Grid>
            )}
            {totalPages > 1 && (
              <Box sx={{display: "flex", justifyContent: "center", mt: 4}}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      "&.Mui-selected": {
                        bgcolor: "#8DBB01",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#7aa300",
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        );
      default:
        return (
          <Box sx={{p: 0, width: "100%"}}>
            <Grid container spacing={3} sx={{width: "100%", mb: 3}}>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    maxWidth: "100%", // <-- Añade esto
                    width: "100%",    // <-- Añade esto
                    mx: "auto",
                    overflow: "hidden",
                    boxSizing: "border-box", // <-- Añade esto
                  }}
                >
                  <Typography variant="h6" sx={{mb: 2}}>
                    Calendario de Pedidos -{" "}
                    {date.toLocaleDateString("es-ES", {
                      month: "long",
                      year: "numeric",
                    })}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(3, 1fr)",
                            md: "repeat(5, 1fr)",
                            lg: "repeat(7, 1fr)",
                          },
                      gap: 2,
                      width: "100%",
                      mx: "auto",
                      minHeight: 180,
                    }}
                  >
                    {renderCalendarDays()}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#fdfaf6",
        width: "100vw", // Asegura que no se pase del ancho de la pantalla
        overflowX: "hidden", // Elimina scroll horizontal
        minHeight: "100vh",
      }}
    >
      <AdminSidebar
        selected={selectedTab}
        onSelect={setSelectedTab}
        user={auth?.user}
        onSettingsSelect={handleSettingsSelect}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 3 },
          width: "100%", // <-- Asegura 100% en mobile
          ml: { xs: 0, sm: 1 },
          mr: { xs: 0, sm: 3 },
          mt: { xs: 2, sm: 4 },
          boxSizing: "border-box",
          overflowX: "hidden",
          pb: { xs: 8, sm: 0 },
          maxWidth: "100vw", // <-- Evita desbordes horizontales
        }}
      >
        <Box
          sx={{
            width: "100%",
            mx: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                gap: 2,
              }}
            >
              <Typography variant="h4" sx={{fontWeight: 600, color: "#333"}}>
                {selectedTab === "stats"
                  ? "Estadísticas"
                  : selectedTab === "orders"
                  ? "Pedidos"
                  : "Panel de Control"}
              </Typography>
              <IconButton onClick={handleOpenModal}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon sx={{color: "#8DBB01"}} />
                </Badge>
              </IconButton>
            </Box>
            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
              {selectedTab === "orders" && (
                <TextField
                  size="small"
                  placeholder="Buscar pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: { xs: "100%", sm: 250 }, // <-- Responsive
                    maxWidth: 350,
                    mr: { xs: 0, sm: 9 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": {
                        borderColor: "#8DBB01",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8DBB01",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputBase-input": {
                      "&::placeholder": {
                        opacity: 1,
                        color: "#aaa",
                      },
                    },
                  }}
                />
              )}
            </Box>
          </Box>

          {renderContent()}
        </Box>
      </Box>

      <AdminSettings
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setSettingsType(null);
        }}
        type={settingsType}
      />

      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
      >
        <Alert
          onClose={() => setNotification(null)}
          severity={notification?.severity}
          sx={{
            width: "100%",
            "&.MuiAlert-standardSuccess": {
              bgcolor: "#e8f5e9",
              color: "#2e7d32",
            },
            "&.MuiAlert-standardInfo": {
              bgcolor: "#e3f2fd",
              color: "#1565c0",
            },
          }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>

      <NotificationsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        notifications={notifications}
        onClearNotifications={handleClearNotifications}
      />
    </Box>
  );
};

export default AdminAccountPage;
