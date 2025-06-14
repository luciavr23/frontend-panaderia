import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import {format} from "date-fns";
import {es} from "date-fns/locale";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const NotificationsModal = ({
  open,
  onClose,
  notifications,
  onClearNotifications,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
          boxShadow: "0px 6px 18px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          color: "#8DBB01",
          borderBottom: "1px solid #e0e0e0",
          pb: 1,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Notificaciones de Pedidos
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{maxHeight: 400, overflowY: "auto", px: 2, py: 1.5}}
      >
        {notifications.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{py: 4}}
          >
            No hay notificaciones pendientes
          </Typography>
        ) : (
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        Nuevo pedido #{notification.orderNumber}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Cliente:{" "}
                          {notification.clientName && notification.clientSurname
                            ? `${notification.clientName} ${notification.clientSurname}`
                            : notification.clientName || "N/A"}
                        </Typography>

                        <br />
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {format(
                            new Date(notification.orderDate),
                            "dd/MM/yyyy HH:mm",
                            {locale: es}
                          )}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{px: 2, pb: 2}}>
        {notifications.length > 0 && (
          <Button
            startIcon={<DeleteIcon />}
            onClick={onClearNotifications}
            variant="outlined"
            color="error"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#d32f2f",
              "&:hover": {
                borderColor: "#9a0007",
                color: "#9a0007",
              },
            }}
          >
            Limpiar notificaciones
          </Button>
        )}
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#8DBB01",
            color: "#8DBB01",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#5a774a",
              color: "#5a774a",
            },
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationsModal;
