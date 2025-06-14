import React, {useEffect, useState, useContext, useRef} from "react";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";
import {useParams} from "react-router-dom";
import {
  Pagination,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardActions,
  CardMedia,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import AllergenIcons from "../components/products/AllergenIcons";
import {getAvailableProducts, getAllProducts} from "../service/productService";
import {getAllCategories} from "../service/categoryService";
import {AuthContext} from "../context/AuthContext";
import {CLOUDINARY_BASE_URL} from "../service/cloudinaryService";
import {useCart} from "../context/CartContext";
import Snackbar from "@mui/material/Snackbar";

import EditProductModal from "../components/products/EditProductModal";
import {getAllAllergens} from "../service/allergenService";
import {updateProduct, deleteProduct} from "../service/productService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProductModal from "../components/products/AddProductModal";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import Footer from "../components/Footer";
import SearchIcon from "@mui/icons-material/Search";
import useMediaQuery from "@mui/material/useMediaQuery";

const MAX_ALLERGENS_VISIBLE = 3;

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
};

const ProductPage = () => {
  const {categoryId} = useParams();
  const {auth} = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const {addToCart} = useCart();
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando productos");
  const [error, setError] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [allAlergenos, setAllAlergenos] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [allergenModalOpen, setAllergenModalOpen] = useState(false);
  const [allergenModalList, setAllergenModalList] = useState([]);
  const [allergenModalTitle, setAllergenModalTitle] = useState("");

  const isAdmin = auth?.user?.role?.toUpperCase() === "ADMIN";
  const isMobile = useMediaQuery("(max-width:600px)");
  const mainContentRef = useRef(null);

  const waitForImagesToLoad = (imageUrls = []) => {
    return Promise.all(
      imageUrls.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve;
          })
      )
    );
  };

  const filterProducts = (products, query) => {
    if (!query.trim()) return products;

    const normalizedQuery = normalizeText(query);
    return products.filter(
      (product) =>
        normalizeText(product.name).includes(normalizedQuery) ||
        normalizeText(product.description || "").includes(normalizedQuery)
    );
  };

  const paginateProducts = (products, page, pageSize = 6) => {
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      content: products.slice(startIndex, endIndex),
      totalPages: Math.ceil(products.length / pageSize),
    };
  };
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/topic/products", (message) => {
          const updatedProduct = JSON.parse(message.body);

          if (!updatedProduct.available) {
            setAllProducts((prev) =>
              prev.filter((p) => p.id !== updatedProduct.id)
            );
          } else {
            setAllProducts((prev) => {
              const filtered = prev.filter((p) => p.id !== updatedProduct.id);
              const updated = [...filtered, updatedProduct];

              return updated.sort((a, b) =>
                a.name.localeCompare(b.name, "es", {sensitivity: "base"})
              );
            });
          }
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, []);
  useEffect(() => {
    window.scrollTo({top: 0, behavior: "smooth"});
  }, [page]);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev.endsWith("...")) return "Cargando productos";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(false);

      try {
        const productResponse = isAdmin
          ? await getAllProducts(0, "name", "asc", categoryId, "")
          : await getAvailableProducts(0, "name", "asc", categoryId, "");

        let allProductsData = [...productResponse.content];

        if (productResponse.totalPages > 1) {
          const promises = [];
          for (let i = 1; i < productResponse.totalPages; i++) {
            promises.push(
              isAdmin
                ? getAllProducts(i, "name", "asc", categoryId, "")
                : getAvailableProducts(i, "name", "asc", categoryId, "")
            );
          }

          const allPages = await Promise.all(promises);
          allPages.forEach((pageData) => {
            allProductsData = [...allProductsData, ...pageData.content];
          });
        }

        const allImageUrls = allProductsData.flatMap((product) =>
          (product.images || [])
            .sort((a, b) => a.order - b.order)
            .map((img) => `${CLOUDINARY_BASE_URL}${img.imageUrl}`)
        );

        const allergens = await getAllAllergens();

        await waitForImagesToLoad(allImageUrls);

        setAllProducts(allProductsData);
        setAllAlergenos(allergens);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [categoryId, isAdmin]);

  useEffect(() => {
    const filteredProducts = filterProducts(allProducts, searchQuery);
    const paginatedData = paginateProducts(filteredProducts, page);

    setProducts(paginatedData.content);
    setTotalPages(paginatedData.totalPages);

    if (
      page > 0 &&
      paginatedData.content.length === 0 &&
      paginatedData.totalPages > 0
    ) {
      setPage(0);
    }
  }, [allProducts, searchQuery, page]);

  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      console.log("categoryId:", categoryId);
      if (!categoryId) return;
      try {
        const allCategories = await getAllCategories();
        console.log("Categorías recibidas:", allCategories);
        const category = allCategories.content.find(
          (cat) => cat.id === parseInt(categoryId)
        );
        if (category) {
          setCategoryName(category.name);
        } else {
          console.warn("Categoría no encontrada con ID:", categoryId);
        }
      } catch (error) {
        console.error("Error al obtener la categoría:", error);
      }
    };

    fetchCategoryName();
  }, [categoryId]);

  const handleAddToCart = (product) => {
    addToCart(product);

    if (snackbarOpen) {
      setSnackbarOpen(false);
      setTimeout(() => {
        setSnackbarMessage(`${product.name} añadido al carrito`);
        setSnackbarOpen(true);
      }, 100);
    } else {
      setSnackbarMessage(`${product.name} añadido al carrito`);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setEditModalOpen(true);
  };

  const refreshProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = isAdmin
        ? await getAllProducts(0, "name", "asc", categoryId, "")
        : await getAvailableProducts(0, "name", "asc", categoryId, "");

      let allProductsData = [...response.content];

      if (response.totalPages > 1) {
        const promises = [];
        for (let i = 1; i < response.totalPages; i++) {
          promises.push(
            isAdmin
              ? getAllProducts(i, "name", "asc", categoryId, "")
              : getAvailableProducts(i, "name", "asc", categoryId, "")
          );
        }

        const allPages = await Promise.all(promises);
        allPages.forEach((pageData) => {
          allProductsData = [...allProductsData, ...pageData.content];
        });
      }

      setAllProducts(allProductsData);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedProduct) => {
    await updateProduct(updatedProduct.id, updatedProduct);
    setEditModalOpen(false);
    setProductToEdit(null);
    await refreshProducts();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    await refreshProducts();
  };

  const handlePageChange = (event, value) => {
    setPage(value - 1);
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({behavior: "smooth"});
    } else {
      window.scrollTo({top: 0, behavior: "smooth"});
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",

        background: "#fdfaf6",
      }}
    >
      <Box sx={{flexGrow: 1}} ref={mainContentRef}>
        {" "}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          flexDirection={{xs: "column", sm: "row"}}
          gap={2}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: "serif",
                fontWeight: 500,
                fontSize: {xs: "2rem", sm: "2.8rem", md: "3rem"},
                mt: {xs: 3, sm: 4, md: 5},
                textAlign: {xs: "center", sm: "left"},
              }}
            >
              Productos de la categoría {categoryName && `"${categoryName}"`}
            </Typography>

            {!isAdmin && (
              <Typography
                variant="body2"
                sx={{
                  color: "gray",
                  fontSize: {xs: "0.85rem", sm: "1rem"},
                  whiteSpace: "nowrap",
                  mt: 3.5,
                  textAlign: {xs: "center", sm: "left"},
                  width: {xs: "100%", sm: "auto"},
                }}
              >
                Todos nuestros productos se venden por ud
              </Typography>
            )}
          </Box>

          <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
            {!isAdmin && (
              <TextField
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: {xs: "100%", sm: 300},
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "white",
                    "&:hover fieldset": {
                      borderColor: "#8DBB01",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#8DBB01",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{color: "#8DBB01"}} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            {isAdmin && (
              <Button
                variant="outlined"
                onClick={() => setAddModalOpen(true)}
                sx={{
                  bgcolor: "#8DBB01",
                  color: "white",
                  "&:hover": {bgcolor: "#5a774a"},
                  height: "fit-content",
                }}
              >
                + Añadir producto
              </Button>
            )}
          </Box>
        </Box>
        <Box sx={{maxWidth: 1200, mx: "auto"}}>
          {loading ? (
            <Box sx={{display: "flex", justifyContent: "center", py: 10}}>
              <Typography variant="h6" color="text.secondary">
                {loadingText}
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{display: "flex", justifyContent: "center", py: 10}}>
              <Typography variant="h6" color="error">
                No se han podido cargar los productos.
              </Typography>
            </Box>
          ) : products.length === 0 ? (
            <Box sx={{display: "flex", justifyContent: "center", py: 10}}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{textAlign: "center"}}
              >
                {searchQuery
                  ? "No hay resultados que coincidan con tu búsqueda."
                  : "No hay productos disponibles en esta categoría."}
              </Typography>
            </Box>
          ) : (
            <Grid
              container
              spacing={3}
              justifyContent="center"
              direction={isMobile ? "column" : "row"}
            >
              {products.map((product) => {
                const sortedImages = [...(product.images || [])].sort(
                  (a, b) => a.order - b.order
                );
                const primaryImage = sortedImages[0]?.imageUrl;
                const secondaryImage = sortedImages[1]?.imageUrl;

                return (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card
                      sx={{
                        width: {xs: "94%", sm: 300},
                        maxWidth: {xs: "94%", sm: 300},
                        height: {xs: 440, sm: isAdmin ? 480 : 440},
                        borderRadius: 4,
                        boxShadow: 3,
                        background: "#fffdfa",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.2s ease-in-out",
                        margin: "auto",
                      }}
                      onMouseEnter={() => setHoveredProductId(product.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                    >
                      <CardMedia
                        component="img"
                        image={`${CLOUDINARY_BASE_URL}${
                          hoveredProductId === product.id && secondaryImage
                            ? secondaryImage
                            : primaryImage
                        }`}
                        alt={product.name}
                        sx={{
                          height: 160,
                          objectFit: "contain",
                          pt: 2,
                          mx: "auto",
                          width: "90%",
                          background: "#fff",
                          borderRadius: 2,
                        }}
                      />

                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minHeight: isAdmin ? 160 : 120,
                          pb: 1,
                        }}
                      >
                        <Box
                          sx={{display: "flex", alignItems: "center", gap: 1}}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 500,
                              fontFamily: "serif",
                              mb: 1,
                              fontSize: {xs: "1.1rem", sm: "1.3rem"},
                              maxWidth: 210,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={product.name}
                          >
                            {product.name}
                          </Typography>
                          {!isAdmin && (
                            <Tooltip
                              title={product.description || ""}
                              arrow
                              componentsProps={{
                                tooltip: {
                                  sx: {
                                    fontSize: "1rem",
                                    maxWidth: 220,
                                    px: 2,
                                    py: 1,
                                  },
                                },
                              }}
                            >
                              <InfoOutlinedIcon
                                sx={{
                                  color: "#bdbdbd",
                                  fontSize: 22,
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 1.5,
                            minHeight: 36,
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          {isMobile ? (
                            <Button
                              size="small"
                              sx={{
                                minWidth: 0,
                                height: 32,
                                borderRadius: 2,
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                background: "#f5f5f5",
                                color: "#8DBB01",
                                border: "1px solid #8DBB01",
                                px: 1.5,
                                lineHeight: 1,
                                flex: "none",
                                textTransform: "none",
                              }}
                              onClick={() => {
                                setAllergenModalList(product.allergens || []);
                                setAllergenModalTitle(product.name);
                                setAllergenModalOpen(true);
                              }}
                            >
                              Ver alérgenos
                            </Button>
                          ) : (
                            <>
                              <AllergenIcons
                                allergens={(product.allergens || []).slice(
                                  0,
                                  MAX_ALLERGENS_VISIBLE
                                )}
                                sx={{verticalAlign: "middle"}}
                              />
                              {(product.allergens || []).length >
                                MAX_ALLERGENS_VISIBLE && (
                                <Button
                                  size="small"
                                  sx={{
                                    minWidth: 25,
                                    height: 25,
                                    borderRadius: "50%",
                                    ml: 0.5,
                                    mb: 1,
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                    background: "#f5f5f5",
                                    color: "#8DBB01",
                                    border: "1px solid #8DBB01",
                                    p: 0,
                                    lineHeight: 1,
                                    flex: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  onClick={() => {
                                    setAllergenModalList(
                                      product.allergens || []
                                    );
                                    setAllergenModalTitle(product.name);
                                    setAllergenModalOpen(true);
                                  }}
                                >
                                  +
                                  {(product.allergens || []).length -
                                    MAX_ALLERGENS_VISIBLE}
                                </Button>
                              )}
                            </>
                          )}
                        </Box>

                        <Box sx={{mt: "auto"}}>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#8D6748",
                              fontWeight: 600,
                              fontSize: "1.1rem",
                            }}
                          >
                            {product.price?.toLocaleString("es-ES", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </Typography>
                          {isAdmin && (
                            <Typography
                              variant="body2"
                              sx={{color: "#8DBB01", fontWeight: 500, mt: 0.5}}
                            >
                              Stock: {product.stock}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>

                      <CardActions
                        sx={{
                          justifyContent: "flex-end",
                          px: 2,
                          pb: 2,
                          mt: "auto",
                        }}
                      >
                        {isAdmin ? (
                          <Box sx={{display: "flex", gap: 1}}>
                            <IconButton
                              onClick={() => handleEdit(product)}
                              sx={{color: "#8DBB01"}}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(product.id)}
                              sx={{color: "#d32f2f"}}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ) : (
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              borderColor: "#8D6748",
                              color: "#8D6748",
                              "&:hover": {
                                background: "#8D6748",
                                color: "#fff",
                                borderColor: "#8D6748",
                              },
                            }}
                            onClick={() => handleAddToCart(product)}
                          >
                            Añadir al carrito
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
        {!loading && !error && totalPages > 1 && (
          <Box sx={{display: "flex", justifyContent: "center", mt: 4}}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
              siblingCount={1}
              boundaryCount={1}
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  "&.Mui-selected": {
                    bgcolor: "#8DBB01",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#7aa300",
                    },
                  },
                },
              }}
            />
          </Box>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{vertical: "top", horizontal: "center"}}
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              color: "#2E7D32",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              borderRadius: "10px",
              px: 2,
              py: 1.2,
              fontWeight: 500,
              fontSize: "0.9rem",
              maxWidth: "300px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
          message={snackbarMessage}
        />
        <EditProductModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          product={productToEdit}
          onSave={handleSave}
          allAlergenos={allAlergenos}
        />
        <AddProductModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={() => {
            setAddModalOpen(false);
            refreshProducts();
          }}
          categoryId={categoryId}
          categoryName={categoryName}
          allAlergenos={allAlergenos}
        />
        <Dialog
          open={allergenModalOpen}
          onClose={() => setAllergenModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              fontFamily: "serif",
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "1.5rem",
              borderBottom: "1px solid #eee",
            }}
          >
            <InfoOutlinedIcon sx={{color: "#8DBB01"}} />
            Alérgenos de {allergenModalTitle}
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
              px: 4,
              py: 3,
            }}
          >
            {allergenModalList && allergenModalList.length > 0 ? (
              allergenModalList.map((alergeno, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 90,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      backgroundColor: "#f2f2f2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <img
                      src={alergeno.iconUrl}
                      alt={alergeno.name}
                      style={{
                        width: 30,
                        height: 30,
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "#333",
                      minHeight: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    {alergeno.name}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary" sx={{fontSize: "1.1rem"}}>
                No incluye alérgenos
              </Typography>
            )}
          </DialogContent>
        </Dialog>
        {loading && (
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
      <Box component="footer" sx={{flexShrink: 0}}>
        <Footer />
      </Box>
    </Box>
  );
};

export default ProductPage;
