import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Button,
  useMediaQuery,
  useTheme,
  Stack,
  Grid,
  Pagination,
  Snackbar,
  Rating,
  Alert,
} from "@mui/material";
import OrderDetailsDialog from "../dialogs/OrderDetailsDialog";

import {resendOrderTicket, deleteOrder} from "../../service/orderService";
import {AuthContext} from "../../context/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";

const statusLabels = {
  EN_PREPARACION: "En preparación",
  LISTO: "Completado",
  CANCELADO: "Cancelado",
};

const tabStatuses = ["EN_PREPARACION", "LISTO", "CANCELADO"];
const ITEMS_PER_PAGE = 3;

const OrdersTabs = ({orders, setOrders}) => {
  const {auth} = useContext(AuthContext);
  const token = auth.token;
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getOrdersByStatus = (status) =>
    orders
      .filter((order) => {
        if (order.status !== status) return false;

        if (status === "LISTO") {
          const orderDate = new Date(order.orderDate);
          const now = new Date();
          const diffInDays =
            (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
          return diffInDays <= 15;
        }

        return true;
      })
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  const handleDeleteOrder = (orderId) => {
    const orderToRemove = orders.find((o) => o.id === orderId);
    if (orderToRemove?.status === "CANCELADO") {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setSnackbar({
        open: true,
        message: "Pedido eliminado",
        severity: "success",
      });
    }
  };

  const handleResendTicket = async (orderId) => {
    try {
      await resendOrderTicket(orderId, token);
      setSnackbar({
        open: true,
        message: "Ticket reenviado con éxito",
        severity: "success",
      });
    } catch (e) {
      setSnackbar({
        open: true,
        message: e.message || "Error al reenviar el ticket",
        severity: "error",
      });
    }
  };

  const currentOrders = getOrdersByStatus(tabStatuses[tab]);
  const paginatedOrders = currentOrders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box display="flex" flexDirection="column" minHeight="80vh">
      <Tabs
        value={tab}
        onChange={(_, v) => {
          setTab(v);
          setPage(1);
        }}
        textColor="inherit"
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons={isMobile ? "auto" : false}
        sx={{
          "& .MuiTabs-indicator": {backgroundColor: "#8DBB01"},
          "& .Mui-selected": {color: "#8DBB01 !important"},
        }}
      >
        {tabStatuses.map((status) => (
          <Tab key={status} label={statusLabels[status]} />
        ))}
      </Tabs>

      {currentOrders.length > ITEMS_PER_PAGE && (
        <Box display="flex" justifyContent="center" mb={1}>
          <Pagination
            count={Math.ceil(currentOrders.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            siblingCount={1}
            boundaryCount={1}
            showFirstButton
            showLastButton
            size="large"
            sx={{
              mt: {xs: 2, md: 0},
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

      <Box flex="1">
        {paginatedOrders.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{mt: 4, textAlign: "center"}}
          >
            {tab === 0 && "Aún no hay pedidos en preparación"}
            {tab === 1 && "Aún no hay pedidos completados"}
            {tab === 2 && "Aún no hay pedidos cancelados"}
          </Typography>
        ) : (
          paginatedOrders.map((order) => (
            <Paper
              key={order.id}
              sx={{
                p: 3,
                mb: 2,
                width: "80%",
                maxWidth: "80%",
                borderRadius: 4,
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
                transition: "0.3s ease",
                "&:hover": {boxShadow: "0px 6px 18px rgba(0,0,0,0.12)"},
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                flexDirection={isMobile ? "column" : "row"}
                mb={2}
              >
                <Typography variant="h6" fontWeight={600}>
                  Pedido #{order.id}
                </Typography>

                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                >
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.orderDate).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Typography>
                  {order.review && (
                    <Box mt={1} textAlign="right">
                      <Typography variant="body2" color="text.secondary">
                        Tu valoración:
                      </Typography>
                      <Rating
                        value={order.review.stars}
                        readOnly
                        precision={0.5}
                        size="small"
                      />
                    </Box>
                  )}
                  {order.status === "CANCELADO" && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#d32f2f",
                        mt: 1,
                        "&:hover": {
                          borderColor: "#9a0007",
                          color: "#9a0007",
                        },
                      }}
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Eliminar
                    </Button>
                  )}
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary">
                {statusLabels[order.status]}
              </Typography>
              <Typography variant="h6" color="#8DBB01" fontWeight={700} mt={1}>
                {order.total.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </Typography>

              {order.products?.slice(0, 3).map((p, i) => (
                <Typography variant="body2" key={i}>
                  - {p.productName} x{p.quantity}
                </Typography>
              ))}
              {order.products?.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  y {order.products.length - 3} más...
                </Typography>
              )}

              <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                {order.status !== "CANCELADO" && (
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#8DBB01",
                      color: "#8DBB01",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {borderColor: "#5a774a", color: "#5a774a"},
                    }}
                    onClick={() => handleResendTicket(order.id)}
                  >
                    Reenviar Ticket
                  </Button>
                )}

                <Button
                  sx={{
                    backgroundColor: "#8DBB01",
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#fff",
                    "&:hover": {backgroundColor: "#7aa300"},
                  }}
                  onClick={() => {
                    setSelectedOrder(order);
                    setOpenDetails(true);
                  }}
                >
                  Ver detalles
                </Button>

                {order.status === "LISTO" && !order.review && (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#f3d427",
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#fff",
                      "&:hover": {backgroundColor: "#ffea75"},
                    }}
                    onClick={() => navigate(`/valoracion/${order.id}`)}
                  >
                    Dejar valoración
                  </Button>
                )}
              </Box>
            </Paper>
          ))
        )}
      </Box>

      <OrderDetailsDialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        order={selectedOrder}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
        anchorOrigin={{vertical: "top", horizontal: "center"}}
      >
        <Alert severity={snackbar.severity} sx={{width: "100%"}}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrdersTabs;
