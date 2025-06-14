import React, {useState, useEffect, useContext} from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Alert,
  CircularProgress,
} from "@mui/material";
import {addReview, getReviewByOrder} from "../../service/reviewService";
import {getOrderById} from "../../service/orderService";
import {useParams, useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

const ReviewForm = ({userId: propUserId, orderId: propOrderId, onSuccess}) => {
  const params = useParams();
  const navigate = useNavigate();
  const {auth} = useContext(AuthContext);
  const userId = propUserId || auth?.user?.id;
  const orderId = propOrderId || params.orderId;

  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const review = await getReviewByOrder(orderId);
        if (review) {
          setAlreadyReviewed(true);
          return;
        }

        const fetchedOrder = await getOrderById(orderId, auth?.token);
        setOrder(fetchedOrder);
      } catch (err) {
        setError("No se pudo cargar la información del pedido.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchData();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!stars) {
      setError("Debes seleccionar una puntuación.");
      return;
    }

    try {
      await addReview({userId, orderId, stars, comment}, auth?.token);
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => navigate("/mi-cuenta"), 2000);
    } catch (err) {
      setError("No se pudo enviar la reseña.");
    }
  };

  if (loading) {
    return (
      <Box sx={{textAlign: "center", mt: 6}}>
        <CircularProgress />
      </Box>
    );
  }

  if (alreadyReviewed) {
    return (
      <Box sx={{mt: 4, textAlign: "center"}}>
        <Alert severity="info">Ya has valorado este pedido.</Alert>
        <Button
          variant="contained"
          sx={{mt: 2}}
          onClick={() => navigate("/mi-cuenta")}
        >
          Volver a mi cuenta
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        px: 3,
        py: 3,
        width: "100%",
        maxWidth: {xs: "90vw", sm: "500px", md: "600px"},
        backgroundColor: "white",
        borderRadius: 2,
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Deja tu reseña
      </Typography>

      {order && (
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Pedido: <strong>{order.orderNumber || `#${order.id}`}</strong>
          </Typography>

          <Box
            sx={{
              maxHeight: 120,
              overflowY: "auto",
              border: "1px solid #eee",
              borderRadius: 1,
              px: 1,
              py: 1,
              mb: 1,
              backgroundColor: "#fdfdfd",
            }}
          >
            {order.products?.map((prod, i) => (
              <Typography
                key={i}
                variant="body2"
                color="text.secondary"
                sx={{fontSize: "0.85rem"}}
              >
                • {prod.productName} x{prod.quantity}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      <Rating
        value={stars}
        onChange={(e, newValue) => setStars(newValue)}
        precision={0.5}
      />

      <TextField
        label="Comentario"
        multiline
        rows={3}
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">¡Gracias por tu reseña!</Alert>}

      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "#8DBB01",
          fontWeight: 600,
          "&:hover": {backgroundColor: "#7aa300"},
        }}
        disabled={stars === 0}
      >
        Enviar
      </Button>

      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        sx={{mt: 1}}
      >
        Tu valoración nos importa
      </Typography>
    </Box>
  );
};

export default ReviewForm;
