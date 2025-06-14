import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Grid,
  Box,
  Divider,
  Button,
} from "@mui/material";

const OrderDetailsDialog = ({open, onClose, order}) => {
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
        Resumen del Pedido
      </DialogTitle>

      <DialogContent
        dividers
        sx={{maxHeight: 400, overflowY: "auto", px: 2, py: 1.5}}
      >
        <Stack spacing={2}>
          {order?.products?.map((p, idx) => (
            <Box key={idx}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography fontWeight={600}>{p.productName}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">x{p.quantity}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">
                    {p.price.toFixed(2)} €
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{mt: 1}} />
            </Box>
          ))}
          <Typography variant="h6" align="right" color="#8DBB01">
            Total:{" "}
            {order?.total?.toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR",
            })}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{px: 2, pb: 2}}>
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

export default OrderDetailsDialog;
