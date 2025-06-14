import React, {useState, useEffect} from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import {webSocketService} from "../../service/WebSocketService";
import {updateOrderStatus} from "../../service/orderService";
import {useAuth} from "../../context/AuthContext";
import {format} from "date-fns";
import {es} from "date-fns/locale";

const statusColors = {
  EN_PREPARACION: "warning",
  LISTO: "success",
  CANCELADO: "error",
};

const statusLabels = {
  EN_PREPARACION: "En preparación",
  LISTO: "Listo",
  CANCELADO: "Cancelado",
};

const AdminOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [pickupTime, setPickupTime] = useState("");
  const [loading, setLoading] = useState(true);
  const {token} = useAuth();
  const [filter, setFilter] = useState("EN_PREPARACION");

  useEffect(() => {
    fetchOrders();

    const handleNewOrder = (order) => {
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

    const handleOrderCancelled = (order) => {
      setOrders((prevOrders) => prevOrders.filter((o) => o.id !== order.id));
    };

    webSocketService.addSubscriber("new-order", handleNewOrder);
    webSocketService.addSubscriber("order-cancelled", handleOrderCancelled);

    return () => {
      webSocketService.removeSubscriber("new-order", handleNewOrder);
      webSocketService.removeSubscriber(
        "order-cancelled",
        handleOrderCancelled
      );
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/orders/today", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Pedidos recibidos:", data);
        setOrders(data);
      } else {
        console.error("Error al cargar pedidos:", response.statusText);
      }
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatus(
        orderId,
        newStatus,
        pickupTime,
        token
      );
      if (response.ok) {
        setOpenDialog(false);
        setPickupTime("");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setPickupTime("");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número de Pedido</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No hay pedidos para hoy
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>
                    {format(new Date(order.orderDate), "dd/MM/yyyy HH:mm", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>{order.user?.name || "N/A"}</TableCell>
                  <TableCell>{order.totalPrice}€</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[order.status]}
                      color={statusColors[order.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {order.status === "EN_PREPARACION" && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleOpenDialog(order)}
                      >
                        Marcar como Listo
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Establecer hora de recogida</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Hora de recogida"
            type="time"
            fullWidth
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={() => handleStatusChange(selectedOrder?.id, "LISTO")}
            color="primary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrdersTable;
