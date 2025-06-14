import React, {useState} from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router-dom";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import StripeCheckoutForm from "../components/payment/StripeCheckoutForm";
import {useCart} from "../context/CartContext";
import {STRIPE_PUBLIC_KEY, IVA_PERCENTAGE} from "../utils/constants";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {cart, total} = useCart();
  const [errorMinAmount, setErrorMinAmount] = useState(false);

  const subtotal =
    typeof total === "number" ? total / (1 + IVA_PERCENTAGE / 100) : 0;
  const iva = typeof total === "number" ? total - subtotal : 0;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {!isMobile && (
        <ArrowBackIcon
          sx={{
            position: "fixed",
            top: 10,
            left: 20,
            fontSize: {xs: 30, md: 40},
            color: "#8DBB01",
            cursor: "pointer",
            zIndex: 5,
          }}
          onClick={() => navigate("/")}
        />
      )}

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/fondos/fondoPanaderia.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: {xs: "none", md: "blur(10px)"},
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(253, 246, 236, 0.85)",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          position: "relative",
          zIndex: 2,
          px: {xs: 0, sm: 2, md: 0},
        }}
      >
        <Paper
          elevation={isMobile ? 2 : 10}
          sx={{
            display: "flex",
            flexDirection: {xs: "column", md: "row"},
            gap: {xs: 3, md: 4},
            p: {xs: 1, sm: 2, md: 4},
            borderRadius: {xs: 1, md: 3},
            maxWidth: {xs: 1, sm: 500, md: 1000},
            width: {xs: "100vw", sm: "100%", md: "100%"},
            backgroundColor: "rgba(255,255,255,0.98)",
            boxShadow: {
              xs: "0 2px 8px rgba(0,0,0,0.07)",
              md: "0 8px 24px rgba(0,0,0,0.2)",
            },
            m: {xs: 0, sm: "auto"},
          }}
        >
          <Box flex={1} sx={{minWidth: 0, width: {xs: "100%", md: "auto"}}}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                mb: 2,
                fontWeight: 600,
                fontFamily: "'Playfair Display', serif",
                color: "#333",
                fontSize: {xs: 20, sm: 24, md: 28},
              }}
            >
              Resumen del pedido
            </Typography>

            <Box
              sx={{
                maxHeight: {xs: 180, sm: 250, md: 300},
                overflowY: "auto",
                pr: 1,
                mb: 2,
                border: "1px solid #eee",
                borderRadius: 2,
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
                backgroundColor: "#fafafa",
                p: 2,
              }}
            >
              {cart.map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography fontSize={{xs: 14, sm: 16}}>
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography fontSize={{xs: 14, sm: 16}}>
                    {(item.price * item.quantity).toFixed(2)} €
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              mt={2}
              pt={2}
              sx={{
                borderTop: "1px solid #ddd",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: {xs: 13, sm: 15},
                }}
              >
                <span>Subtotal (sin IVA):</span>
                <span>{subtotal.toFixed(2)} €</span>
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#888",
                  fontStyle: "italic",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: {xs: 13, sm: 15},
                }}
              >
                <span>IVA ({IVA_PERCENTAGE}%):</span>
                <span>{iva.toFixed(2)} €</span>
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                mt={1}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#333",
                  fontSize: {xs: 16, sm: 20},
                }}
              >
                <span>Total (con IVA):</span>
                <span>{total.toFixed(2)} €</span>
              </Typography>
              {errorMinAmount && (
                <Box
                  mt={2}
                  display="flex"
                  alignItems="center"
                  color="error.main"
                >
                  <InfoOutlinedIcon sx={{mr: 1}} />
                  <Typography variant="body2" fontSize={{xs: 13, sm: 15}}>
                    El importe mínimo del pedido debe ser de 0,50 €.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box
            flex={1}
            sx={{
              minWidth: 0,
              mt: {xs: 2, md: 0},
              width: {xs: "100%", md: "auto"},
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                mb: 2,
                fontWeight: 600,
                fontFamily: "'Playfair Display', serif",
                color: "#333",
                fontSize: {xs: 20, sm: 24, md: 28},
              }}
            >
              Pago con tarjeta
            </Typography>
            <Elements stripe={stripePromise}>
              <StripeCheckoutForm
                setErrorMinAmount={setErrorMinAmount}
                allowEmptyPostalCode
              />
            </Elements>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
