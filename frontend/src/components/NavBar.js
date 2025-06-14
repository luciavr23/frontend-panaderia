import React, {useState, useEffect, useContext} from "react";
import {useLocation, NavLink, Link, useNavigate} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Button,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/logos/1.png";
import Login from "../components/login/Login";
import {useCart} from "../context/CartContext";
import Cart from "../pages/Cart";
import {AuthContext} from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const {cart, clearCart} = useCart();
  const isCheckout = location.pathname === "/pago";
  const isPaySuc = location.pathname === "/pago-exitoso";
  const isPayCan = location.pathname === "/pago-cancelado";
  const {auth, logoutAuth} = useContext(AuthContext);
  const userRole = auth?.user?.role?.toUpperCase();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);

  const isAdmin = auth?.user?.role?.toUpperCase() === "ADMIN";
  const isAccountSection =
    location.pathname.startsWith("/mi-cuenta") ||
    location.pathname.startsWith("/admin");

  const handleAccountClick = (event) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setAnchorEl(event.currentTarget);
    } else {
      setLoginOpen(true);
    }
  };

  const handleLogout = () => {
    logoutAuth();
    clearCart();
    setAnchorEl(null);
    sessionStorage.removeItem("cart");
    navigate("/", {state: {fromLogout: true}});
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
    if (location.search.includes("login=true")) {
      window.history.replaceState(null, "", location.pathname);
    }
  };

  const handleGoBack = () => navigate(-1);

  const navLinkStyle = {
    marginRight: "1rem",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "bold",
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("login") === "true") {
      setLoginOpen(true);
    }
  }, [location]);

  const openLoginFromCart = () => {
    sessionStorage.setItem("redirectReason", "cart");
    setLoginOpen(true);
  };

  return (
    <>
      <AppBar position="static" sx={{backgroundColor: "#E1E5C9"}} elevation={2}>
        <Toolbar>
          {/* Quitar flecha de back en móviles */}
          {!isMobile && location.pathname !== "/" && (
            <IconButton
              onClick={handleGoBack}
              sx={{color: "#808080", mr: 1}}
              aria-label="Volver atrás"
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          {isMobile && isAccountSection && (
            <IconButton
              onClick={() => setAdminDrawerOpen(true)}
              sx={{color: "#2d2d2d", mr: 1}}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <img
              src={logo}
              alt="Logo Panadería Ana"
              style={{height: 48, marginRight: 8}}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: {xs: "1.15rem", sm: "1.3rem", md: "2rem"},
                fontFamily: "serif",
                color: "#2d2d2d",
                letterSpacing: 1,
                ml: 0,
                whiteSpace: "nowrap",
                overflow: "visible",
                textOverflow: "unset",
                maxWidth: "unset",
                display: "block",
              }}
            >
              Panadería Ana
            </Typography>
          </Link>
          <Box sx={{flexGrow: 1}} />
          {!isMobile && (
            <>
              <NavLink
                to="/"
                style={({isActive}) => ({
                  ...navLinkStyle,
                  color: isActive ? "gray" : "black",
                })}
              >
                Home
              </NavLink>
              <NavLink
                to="/productos"
                style={({isActive}) => ({
                  ...navLinkStyle,
                  color: isActive ? "gray" : "black",
                })}
              >
                Productos
              </NavLink>

              <NavLink
                to="/valoraciones"
                style={() => ({
                  ...navLinkStyle,
                  color:
                    location.pathname.startsWith("/valoracion") ||
                    location.pathname === "/valoraciones"
                      ? "gray"
                      : "black",
                })}
              >
                Valoraciones
              </NavLink>

              <NavLink
                to="/sobre-nosotros"
                style={({isActive}) => ({
                  ...navLinkStyle,
                  color: isActive ? "gray" : "black",
                })}
              >
                Sobre Nosotros
              </NavLink>
            </>
          )}
          {userRole !== "ADMIN" && !isCheckout && !isPayCan && !isPaySuc && (
            <IconButton
              color="inherit"
              onClick={() => setCartOpen(true)}
              sx={{
                color: "#8DBB01",
                "&:hover": {color: "#5a774a"},
              }}
            >
              <Badge badgeContent={cartItemsCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}
          <IconButton
            sx={{
              color: isAccountSection ? "gray" : "black",
            }}
            onClick={handleAccountClick}
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem disabled>{isAdmin ? "Administrador" : "Cliente"}</MenuItem>
        {isAdmin ? (
          <MenuItem
            onClick={() => {
              navigate("/admin/dashboard?tab=dashboard");
              setAnchorEl(null);
            }}
          >
            Punto de control
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              navigate("/mi-cuenta");
              setAnchorEl(null);
            }}
          >
            Mi cuenta
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
      </Menu>

      <Login open={loginOpen} onClose={handleLoginClose} />
      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        openLogin={openLoginFromCart}
      />
      <Drawer
        anchor="left"
        open={adminDrawerOpen}
        onClose={() => setAdminDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 240,
            bgcolor: "#fdf6ec",
            borderRight: "1px solid #ddd",
            pt: 2,
          },
        }}
      >
        <Box sx={{px: 2, pb: 2}}>
          <Typography
            variant="subtitle1"
            sx={{fontWeight: 600, mb: 2, color: "#2d2d2d"}}
          >
            {isAdmin ? "Panel administrador" : "Mi cuenta"}
          </Typography>
        </Box>
        <List>
          {isAdmin ? (
            <>
              <ListItem
                button
                onClick={() => {
                  navigate("/admin/dashboard?tab=dashboard");
                  setAdminDrawerOpen(false);
                }}
                sx={{
                  "&:hover": {bgcolor: "#e1e5c9"},
                  "& .MuiListItemIcon-root": {color: "#8DBB01"},
                }}
              >
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate("/admin/dashboard?tab=orders");
                  setAdminDrawerOpen(false);
                }}
                sx={{
                  "&:hover": {bgcolor: "#e1e5c9"},
                  "& .MuiListItemIcon-root": {color: "#8DBB01"},
                }}
              >
                <ListItemText primary="Pedidos" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate("/admin/dashboard?tab=stats");
                  setAdminDrawerOpen(false);
                }}
                sx={{
                  "&:hover": {bgcolor: "#e1e5c9"},
                  "& .MuiListItemIcon-root": {color: "#8DBB01"},
                }}
              >
                <ListItemText primary="Estadísticas" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem
                button
                onClick={() => {
                  navigate("/mi-cuenta?tab=pedidos");
                  setAdminDrawerOpen(false);
                }}
                sx={{
                  "&:hover": {bgcolor: "#e1e5c9"},
                  "& .MuiListItemIcon-root": {color: "#8DBB01"},
                }}
              >
                <ListItemText primary="Mis pedidos" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate("/mi-cuenta?tab=configuracion");
                  setAdminDrawerOpen(false);
                }}
                sx={{
                  "&:hover": {bgcolor: "#e1e5c9"},
                  "& .MuiListItemIcon-root": {color: "#8DBB01"},
                }}
              >
                <ListItemText primary="Configuración" />
              </ListItem>
            </>
          )}
          <ListItem
            button
            onClick={() => {
              handleLogout();
              setAdminDrawerOpen(false);
            }}
            sx={{
              mt: 1,
              borderTop: "1px solid #ddd",
              "&:hover": {bgcolor: "#ffecec"},
              "& .MuiListItemIcon-root": {color: "#d32f2f"},
            }}
          >
            <ListItemText primary="Cerrar sesión" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
