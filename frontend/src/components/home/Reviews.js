import React, {useEffect, useState, useRef} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination, Autoplay, EffectFade} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../App.css";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Rating,
  Divider,
  Link,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {ArrowBackIosNew, ArrowForwardIos} from "@mui/icons-material";

import {getReviews} from "../../service/reviewService";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    getReviews().then(setReviews).catch(console.error);
  }, []);

  const handleToggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (reviews.length === 0) return null;

  return (
    <Box sx={{width: isMobile ? "100%" : "80%", py: 4}}>
      <Box sx={{maxWidth: isMobile ? "100%" : "900px", mx: "auto", px: 2}}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontFamily: "'Merriweather', serif",
            mb: 3,
            color: "#333",
            textAlign: isMobile ? "center" : "left",
            mt: isMobile ? 2 : 3,
            fontSize: isMobile ? "1.6rem" : undefined,
          }}
        >
          Opiniones de clientes
        </Typography>

        <Box sx={{position: "relative"}}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              setSwiperInstance(swiper);
            }}
            pagination={{clickable: true}}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            effect="fade"
            spaceBetween={20}
            slidesPerView={1}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
            {reviews.map((review, index) => {
              const isExpanded = expandedIndex === index;
              const shortComment =
                review.comment.length > 100
                  ? review.comment.slice(0, 100) + "..."
                  : review.comment;

              return (
                <SwiperSlide key={review.id}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: "none",
                      border: "1px solid #e0e0e0",
                      backgroundColor: "#ffffff",
                      mx: isMobile ? 2 : 0,
                    }}
                  >
                    <CardContent sx={{p: isMobile ? 2 : 3}}>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            mr: 2,
                            width: 40,
                            height: 40,
                            bgcolor: "#d9e5d6",
                            color: "#333",
                            fontWeight: "bold",
                            fontSize: "1rem",
                          }}
                        >
                          {review.userName
                            ? review.userName.charAt(0).toUpperCase()
                            : "?"}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{fontWeight: 600}}
                          >
                            {review.userName || "Anónimo"}
                          </Typography>
                          {review.stars && (
                            <Rating
                              value={review.stars}
                              precision={0.5}
                              readOnly
                              size="small"
                            />
                          )}
                        </Box>
                      </Box>
                      <Divider sx={{my: 1}} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#555",
                          lineHeight: 1.6,
                          textAlign: isMobile ? "center" : "left",
                        }}
                      >
                        {isExpanded ? review.comment : shortComment}
                      </Typography>
                      {review.comment.length > 100 && (
                        <Link
                          component="button"
                          variant="body2"
                          sx={{
                            mt: 1,
                            color: "#6b8b57",
                            display: "block",
                            textAlign: isMobile ? "center" : "left",
                          }}
                          onClick={() => handleToggleExpand(index)}
                        >
                          {isExpanded ? "Ver menos" : "Ver más"}
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <IconButton
            ref={prevRef}
            sx={{
              position: "absolute",
              top: "50%",
              left: isMobile ? 8 : -40,
              transform: "translateY(-50%)",
              color: "#6b8b57",
              backgroundColor: "#f5f5f5",
              "&:hover": {backgroundColor: "#e0e0e0"},
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
              zIndex: 10,
              opacity: activeIndex === 0 ? 0.5 : 1,
              pointerEvents: activeIndex === 0 ? "none" : "auto",
            }}
            disabled={activeIndex === 0}
          >
            <ArrowBackIosNew fontSize={isMobile ? "inherit" : "small"} />
          </IconButton>

          <IconButton
            ref={nextRef}
            sx={{
              position: "absolute",
              top: "50%",
              right: isMobile ? 8 : -40,
              transform: "translateY(-50%)",
              color: "#6b8b57",
              backgroundColor: "#f5f5f5",
              "&:hover": {backgroundColor: "#e0e0e0"},
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
              zIndex: 10,
              opacity: activeIndex === reviews.length - 1 ? 0.5 : 1,
              pointerEvents:
                activeIndex === reviews.length - 1 ? "none" : "auto",
            }}
            disabled={activeIndex === reviews.length - 1}
          >
            <ArrowForwardIos fontSize={isMobile ? "inherit" : "small"} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Reviews;
