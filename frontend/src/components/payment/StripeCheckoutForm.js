import React, {useState, useEffect, useContext} from "react";
import {
  Box,
  Typography,
  Alert,
  Button,
  Paper,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Container,
  Toolbar,
  TextField,
} from "@mui/material";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {useCart} from "../../context/CartContext";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {
  validateStock,
  createOrderWithPayment,
} from "../../service/orderService";
import {getContactInfo} from "../../service/contactService";
import {createPaymentIntent} from "../../service/stripeService";

const steps = ["Resumen", "Pago"];

const StripeCheckoutForm = ({setErrorMinAmount}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState("");
  const {cart, total, clearCart} = useCart();
  const {auth} = useContext(AuthContext);
  const token = auth?.token;
  const email = auth.user?.email ?? "cliente@example.com";
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Pagar");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [bakeryAddress, setBakeryAddress] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  useEffect(() => {
    getContactInfo().then((info) => {
      if (info?.street && info?.city && info?.province && info?.postalCode) {
        const fullAddress = `${info.street}, ${info.province}, ${info.city}, ${info.postalCode}`;
        setBakeryAddress(fullAddress);
      }
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      setButtonText("Pagar");
      return;
    }

    let dots = "";
    const intervalId = setInterval(() => {
      dots = dots.length < 3 ? dots + "." : "";
      setButtonText(`Pagando${dots}`);
    }, 500);

    return () => clearInterval(intervalId);
  }, [loading]);

  const confirmPayment = async (clientSecret) => {
    const {error, paymentIntent} = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email,
            name: cardHolderName,
          },
        },
      }
    );

    if (error) throw new Error(error.message);
    if (paymentIntent.status !== "succeeded") {
      throw new Error("El pago no fue exitoso.");
    }

    return paymentIntent.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const amountInCents = Math.round(total * 100);
    if (amountInCents < 50) {
      setErrorMinAmount(true);
      setLoading(false);
      return;
    }

    setErrorMinAmount(false);
    try {
      if (!stripe || !elements) throw new Error("Stripe no está disponible.");
      await validateStock(cart, token);
      const clientSecret = await createPaymentIntent(total, email, token);
      const paymentIntentId = await confirmPayment(clientSecret);
      await createOrderWithPayment(cart, paymentIntentId, token);
      clearCart();
      setActiveStep(2);
      navigate("/pago-exitoso");
    } catch (err) {
      setErrorMessage(err.message || "Error al procesar el pago");
      navigate("/pago-cancelado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{my: 6}}>
      <Paper sx={{p: 4}}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{mb: 4}}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    color: activeStep === index ? "#e0e4c8" : "inherit",
                    "&.Mui-completed": {
                      color: "#e0e4c8",
                    },
                    "&.Mui-active": {
                      color: "#e0e4c8",
                    },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Instrucciones para recoger el pedido
            </Typography>
            <Typography sx={{mb: 3}}>
              El pedido deberá de ser recogido en la siguiente dirección:
            </Typography>
            <Typography fontWeight={600}>
              {bakeryAddress || "Cargando dirección..."}
            </Typography>

            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button
                variant="contained"
                onClick={() => setActiveStep(1)}
                sx={{
                  backgroundColor: "#8DBB01",
                  "&:hover": {backgroundColor: "#5a774a"},
                }}
              >
                Continuar al pago
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Introduce los datos de tu tarjeta
            </Typography>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: 2,
                p: 3,
                mb: 2,
                backgroundColor: "#fff",
              }}
            >
              {/* revisar */}
              <TextField
                label="Nombre del titular"
                variant="outlined"
                fullWidth
                required
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                sx={{
                  mb: 2,
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#8DBB01",
                    },
                    "&:hover fieldset": {
                      borderColor: "#5a774a",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#8DBB01",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#8DBB01",
                    fontWeight: 600,
                    "&.Mui-focused": {
                      color: "#5a774a",
                    },
                  },
                  input: {
                    color: "#2d2d2d",
                    fontWeight: 500,
                  },
                }}
              />

              <CardElement
                onChange={(event) => {
                  setCardComplete(event.complete);
                  setCardError(event.error ? event.error.message : "");
                }}
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: "18px",
                      color: "#2d2d2d",
                      "::placeholder": {color: "#bdbdbd"},
                    },
                    invalid: {
                      color: "#f44336",
                    },
                  },
                }}
              />
              {cardError && (
                <Alert severity="error" sx={{mb: 2}}>
                  {cardError}
                </Alert>
              )}
            </Box>

            {errorMessage && (
              <Alert severity="error" sx={{mb: 2}}>
                {errorMessage}
              </Alert>
            )}

            <Box sx={{display: "flex", justifyContent: "space-between", mt: 2}}>
              <Button
                onClick={() => setActiveStep(0)}
                variant="outlined"
                sx={{
                  color: "#8DBB01",
                  borderColor: "#8DBB01",
                  "&:hover": {
                    borderColor: "#5a774a",
                    color: "#5a774a",
                    backgroundColor: "rgba(224, 228, 200, 0.08)",
                  },
                }}
              >
                Atrás
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={!stripe || loading || !cardComplete}
                sx={{
                  backgroundColor: "#8DBB01",
                  color: "#fff",
                  fontWeight: 600,
                  "&:hover": {backgroundColor: "#5a774a"},
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  buttonText
                )}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default StripeCheckoutForm;
