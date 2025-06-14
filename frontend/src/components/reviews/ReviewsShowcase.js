import React, {useEffect, useState} from "react";
import {
  Avatar,
  Box,
  Typography,
  Rating,
  CircularProgress,
  Card,
  CardContent,
  Container,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import {getAllReviews} from "../../service/reviewService";
import "swiper/css";
import "swiper/css/navigation";
import Footer from "../Footer";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const truncate = (text, limit = 100) =>
  text.length > limit ? text.slice(0, limit) + "..." : text;

const ReviewsShowcase = () => {
  const [reviews, setReviews] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(254, 250, 243, 0.85)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(2px)",
        }}
      >
        <Box
          sx={{
            border: "6px solid #cce5b1",
            borderTop: "6px solid #8DBB01",
            borderRadius: "50%",
            width: 60,
            height: 60,
            animation: "spin 1s linear infinite",
          }}
        />
        <style>
          {`@keyframes spin {
             0% { transform: rotate(0deg); }
             100% { transform: rotate(360deg); }
           }`}
        </style>
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{py: 1}}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            fontSize: {xs: "2rem", sm: "2.5rem", md: "3rem"},
            lineHeight: 1.2,
            letterSpacing: "-1px",
            textAlign: {xs: "center", md: "left"},
            mb: {xs: 3, md: 3},
            mt: 1,
          }}
          gutterBottom
        >
          Opiniones de nuestros clientes
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          La opinión de nuestros clientes es nuestra mejor carta de
          presentación.
        </Typography>
        <Box sx={{bgcolor: "#fefaf3", py: 6}}>
          <Container maxWidth="lg">
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                600: {slidesPerView: 2},
                900: {slidesPerView: 3},
              }}
              style={{paddingBottom: "40px"}}
            >
              {reviews.map((review) => {
                const isExpanded = expandedIds.includes(review.id);
                return (
                  <SwiperSlide key={review.id}>
                    <Card
                      sx={{
                        minHeight: 280,
                        maxHeight: 280,
                        overflow: "hidden",
                        borderRadius: 4,
                        bgcolor: "white",
                        border: "1px solid #eee",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0px 2px 10px rgba(0,0,0,0.04)",
                      }}
                    >
                      <CardContent sx={{p: 0}}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{bgcolor: "#8DBB01"}}>
                            {getInitials(review.userName)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="bold">
                              {review.userName}
                            </Typography>
                            <Rating
                              value={review.stars}
                              readOnly
                              precision={0.5}
                              size="small"
                            />
                          </Box>
                        </Box>

                        <Typography sx={{mt: 2, fontSize: "0.95rem"}}>
                          {isExpanded
                            ? review.comment
                            : truncate(review.comment, 100)}
                        </Typography>

                        {review.comment.length > 100 && (
                          <Button
                            size="small"
                            onClick={() => toggleExpand(review.id)}
                            sx={{
                              mt: 1,
                              textTransform: "none",
                              color: "#8DBB01",
                            }}
                          >
                            {isExpanded ? "Ver menos" : "Ver más"}
                          </Button>
                        )}

                        {review.products?.length > 0 && (
                          <Box mt={2}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="bold"
                              gutterBottom
                            >
                              Productos:
                            </Typography>
                            <List dense sx={{pl: 1}}>
                              {review.products.slice(0, 4).map((prod, i) => (
                                <ListItem key={i} disablePadding>
                                  <ListItemText
                                    primary={`- ${prod.productName} x${prod.quantity}`}
                                    primaryTypographyProps={{
                                      fontSize: "0.75rem",
                                      color: "text.secondary",
                                    }}
                                  />
                                </ListItem>
                              ))}
                              {review.products.length > 4 && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{pl: 2}}
                                >
                                  ...y {review.products.length - 4} más.
                                </Typography>
                              )}
                            </List>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Container>
        </Box>
      </Container>

      <Box mt={8}>
        <Footer />
      </Box>
    </>
  );
};

export default ReviewsShowcase;
