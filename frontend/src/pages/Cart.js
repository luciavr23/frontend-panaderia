import React from "react";
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import {useCart} from "../context/CartContext";
import {useNavigate} from "react-router-dom";

const Cart = ({open, onClose, openLogin}) => {
  const {cart, total, removeFromCart, updateQuantity, clearCart} = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const handleCheckout = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      onClose();
      if (typeof openLogin === "function") {
        sessionStorage.setItem("redirectReason", "cart");
        openLogin();
      }
      return;
    }
    onClose();
    navigate("/pago");
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : 400,
          bgcolor: "#E1E5C9",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* CABECERA */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{fontFamily: "'Playfair Display', serif", fontWeight: 600}}
        >
          Carrito
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* LISTA CON SCROLL */}
      <Box sx={{flex: 1, overflowY: "auto", p: 2}}>
        {cart.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">
              Tu carrito está vacío
            </Typography>
          </Box>
        ) : (
          <List>
            {cart.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  bgcolor: "white",
                  mb: 1,
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{fontWeight: 500}}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.price.toFixed(2)} €
                    </Typography>
                  </Box>

                  <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      type="number"
                      value={item.quantity}
                      size="small"
                      inputProps={{
                        min: 1,
                        max: item.stock,
                        style: {textAlign: "center", width: "2.5rem"},
                      }}
                      onChange={(e) => {
                        let value = parseInt(e.target.value) || 1;
                        if (value > item.stock) value = item.stock;
                        if (value < 1) value = 1;
                        updateQuantity(item.id, value);
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (item.quantity < item.stock)
                          updateQuantity(item.id, item.quantity + 1);
                      }}
                      disabled={item.quantity >= item.stock}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => removeFromCart(item.id)}
                      sx={{color: "error.main"}}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* PIE FIJO */}
      <Box sx={{p: 2, borderTop: "1px solid #ccc"}}>
        {cart.length > 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">{total.toFixed(2)} €</Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckout}
              sx={{
                bgcolor: "#8DBB01",
                color: "white",
                mb: 1,
                "&:hover": {
                  bgcolor: "#5a774a",
                },
              }}
            >
              Proceder al Pago
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={clearCart}
              sx={{
                borderColor: "#8DBB01",
                color: "#8DBB01",
                "&:hover": {
                  borderColor: "#5a774a",
                  color: "#5a774a",
                },
              }}
            >
              Vaciar Carrito
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Cart;
