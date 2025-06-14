import React, {useEffect, useState, useContext} from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CategoryCard from "../components/categories/CategoryCards";
import {getAllCategoriesRaw} from "../service/categoryService";
import Footer from "../components/Footer";
import {AuthContext} from "../context/AuthContext";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../App.css";
import AddCategoryModal from "../components/categories/AddCategoryModal";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const {auth} = useContext(AuthContext);
  const userRole = auth?.user?.role?.toUpperCase();
  const [categoriesError, setCategoriesError] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setCategoriesError(false);
    try {
      const data = await getAllCategoriesRaw();
      setCategories(data);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      setCategoriesError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddSuccess = () => {
    fetchCategories();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{flex: 1}}>
        {!loading ? (
          <Container maxWidth="lg" sx={{pt: 4}}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
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
                }}
              >
                Categorías de Productos
              </Typography>
              {userRole === "ADMIN" && (
                <Button
                  variant="outlined"
                  onClick={() => setIsAddModalOpen(true)}
                  sx={{
                    bgcolor: "#8DBB01",
                    color: "white",
                    "&:hover": {bgcolor: "#5a774a"},
                  }}
                >
                  + Añadir categoría
                </Button>
              )}
            </Box>

            {categoriesError ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
              >
                <Typography variant="h6" color="error">
                  No se han podido cargar las categorías.
                </Typography>
              </Box>
            ) : Array.isArray(categories) && categories.length >= 4 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{clickable: true}}
                spaceBetween={20}
                slidesPerView={isMobile ? 1 : isTablet ? 2 : 3}
                style={{paddingBottom: "16px"}}
              >
                {categories.map((cat) => (
                  <SwiperSlide key={cat.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "stretch",
                        height: "100%",
                        p: 1,
                      }}
                    >
                      <CategoryCard
                        category={cat}
                        isAdmin={userRole === "ADMIN"}
                        refreshCategories={fetchCategories}
                      />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                gap={3}
                px={2}
              >
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    isAdmin={userRole === "ADMIN"}
                    refreshCategories={fetchCategories}
                  />
                ))}
              </Box>
            )}
          </Container>
        ) : (
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
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </Box>
        )}
      </Box>

      <AddCategoryModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <Footer />
    </Box>
  );
};

export default CategoryPage;
