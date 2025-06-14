import React, {useEffect, useState} from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {getPopularProducts} from "../../service/productService";
import {CLOUDINARY_BASE_URL} from "../../utils/constants";

function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    getPopularProducts()
      .then(setProducts)
      .catch((err) =>
        console.error("Error cargando productos populares:", err)
      );
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{mt: isMobile ? 0 : isTablet ? 3 : 2}}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          fontFamily: "'Merriweather', serif",
          mb: 3,
          color: "#333",
          textAlign: isMobile ? "center" : "left",
          mt: isMobile ? 1 : 2,
          fontSize: isMobile ? "1.6rem" : undefined,
        }}
        gutterBottom
      >
        Productos Populares
      </Typography>

      {isTablet ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton onClick={handlePrev} sx={{position: "absolute", left: 0}}>
            <ArrowBackIosNewIcon />
          </IconButton>

          {products.length > 0 && (
            <Card
              key={products[currentIndex].id}
              sx={{
                width: "50%",
                maxWidth: 220,
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardMedia
                component="img"
                height={120}
                image={`${CLOUDINARY_BASE_URL}${products[currentIndex].imageUrl}`}
                alt={products[currentIndex].name}
                sx={{objectFit: "cover"}}
              />
              <CardContent sx={{p: 1}}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={{textAlign: "center", fontSize: "0.9rem"}}
                >
                  {products[currentIndex].name}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{textAlign: "center", fontSize: "0.8rem"}}
                >
                  {products[currentIndex].price?.toFixed(2)} €
                </Typography>
              </CardContent>
            </Card>
          )}

          <IconButton
            onClick={handleNext}
            sx={{position: "absolute", right: 0}}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: isTablet ? "center" : "flex-start",
            ml: {md: 4},
          }}
        >
          {products.slice(0, 3).map((product) => (
            <Card
              key={product.id}
              sx={{
                width: isTablet ? "45%" : 200,
                maxWidth: 300,
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardMedia
                component="img"
                height={160}
                image={`${CLOUDINARY_BASE_URL}${product.imageUrl}`}
                alt={product.name}
                sx={{objectFit: "cover"}}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="medium"
                  sx={{textAlign: "left"}}
                >
                  {product.name}
                </Typography>
                <Typography color="text.secondary" sx={{textAlign: "left"}}>
                  {product.price?.toFixed(2)} €
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default PopularProducts;
