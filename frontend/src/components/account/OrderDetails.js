import React from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import ConfirmDialog from "../dialogs/ConfirmDialog";

const OrderDetails = ({order, onOrderUpdated}) => {
  const [confirmDialog, setConfirmDialog] = React.useState(false);
  const [actionType, setActionType] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const statusDisplay = {
    EN_PREPARACION: "En preparación",
    LISTO: "Completado",
    CANCELADO: "Cancelado",
  };

  const statusColor = {
    EN_PREPARACION: "warning",
    LISTO: "success",
    CANCELADO: "default",
  };
  const handleAction = (type) => {
    setActionType(type);
    setConfirmDialog(true);
  };

  const confirmAction = async () => {
    setLoading(true);
    try {
      let nuevoEstado = actionType === "complete" ? "LISTO" : "CANCELADO";
      console.log("Actualizando pedido", order.id, "a estado", nuevoEstado);

      const response = await fetch(
        `/orders/${order.id}/status?status=${nuevoEstado}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok)
        throw new Error("Error al actualizar el estado del pedido");
      setSnackbar({
        open: true,
        message: "Estado actualizado y notificación enviada",
        severity: "success",
      });
      setConfirmDialog(false);
      if (onOrderUpdated) onOrderUpdated();
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Error al actualizar el pedido",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PREPARACION":
        return "#ff9800";
      case "PENDIENTE":
        return "#f44336";
      case "COMPLETADO":
        return "#4caf50";
      case "LISTO":
        return "#4caf50";
      case "CANCELADO":
        return "#9e9e9e";
      default:
        return "#757575";
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{fontWeight: 600}}>
            Pedido #{order.id}
          </Typography>
          <Chip
            label={statusDisplay[order.status] || order.status}
            color={statusColor[order.status] || "default"}
            sx={{
              fontWeight: 600,
              fontSize: "0.75rem",
              px: 1.5,
              borderRadius: 5,
              bgcolor:
                order.status === "EN_PREPARACION"
                  ? "#fff3cd"
                  : order.status === "LISTO"
                  ? "#d4edda"
                  : "#e0e0e0",
              color:
                order.status === "EN_PREPARACION"
                  ? "#856404"
                  : order.status === "LISTO"
                  ? "#155724"
                  : "#555",
            }}
          />
        </Box>

        <Box sx={{mb: 3}}></Box>

        <Divider sx={{my: 2}} />

        <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 2}}>
          Productos
        </Typography>

        <Box sx={{height: 300, overflowY: "auto", pr: 1}}>
          <List disablePadding>
            {order.products?.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  px: 0,
                  py: 0.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{fontWeight: 500}}>
                    {item.productName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.quantity} x {item.price.toFixed(2)}€
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{fontWeight: 600}}>
                  {(item.quantity * item.price).toFixed(2)}€
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{my: 2}} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            mt: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{fontWeight: 600, fontSize: "0.95rem"}}
          >
            Total
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{fontWeight: 700, fontSize: "0.95rem"}}
          >
            {order.total.toFixed(2)}€
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{display: "flex", gap: 2, justifyContent: "flex-end", mt: "auto"}}
      >
        <Button
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={() => handleAction("cancel")}
          disabled={
            order.status === "CANCELADO" || order.status === "LISTO" || loading
          }
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={() => handleAction("complete")}
          disabled={
            order.status === "CANCELADO" ||
            order.status === "COMPLETADO" ||
            order.status === "LISTO" ||
            loading
          }
        >
          Completar
        </Button>
        <IconButton
          color="primary"
          title="Enviar correo al cliente"
          onClick={() => (window.location.href = `mailto:${order.clientEmail}`)}
        >
          <EmailIcon />
        </IconButton>
      </Box>

      <ConfirmDialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        onConfirm={confirmAction}
        title={
          actionType === "complete" ? "Completar Pedido" : "Cancelar Pedido"
        }
        message={`¿Estás seguro de que deseas ${
          actionType === "complete" ? "completar" : "cancelar"
        } este pedido? Se enviará una notificación por correo electrónico al cliente.`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        confirmColor={actionType === "complete" ? "success" : "error"}
        loading={loading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{vertical: "top", horizontal: "center"}}
      >
        <Alert severity={snackbar.severity} sx={{width: "100%"}}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default OrderDetails;
