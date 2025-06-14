import React from "react";
import {useState} from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Routes, Route, useLocation} from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import CookieBanner from "./components/cookies/CookieBanner";
import Register from "./components/login/Register";
import Footer from "./components/Footer";
import {Box} from "@mui/material";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import {CartProvider} from "./context/CartContext";
import ContactPage from "./pages/ContactPage";
import AccountPage from "./pages/AccountPage";
import AdminAccountPage from "./pages/AdminAccountPage";
import ForgotPassword from "./components/login/ForgotPassword";
import ResetPassword from "./components/login/ResetPassword";
import CheckoutPage from "./pages/CheckoutPage";
import MobileBottomNav from "./components/MobileBottomNav";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import ReviewPage from "./pages/ReviewPage";
import ReviewsShowcase from "./components/reviews/ReviewsShowcase";

function App() {
  const location = useLocation();
  const [bannerVisible, setBannerVisible] = useState(false);

  const hideNavbarRoutes = ["/register"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <CartProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {showNavbar && <Navbar />}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            pb: bannerVisible ? "120px" : "0px",
            transition: "padding-bottom 0.3s ease",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/productos" element={<CategoryPage />} />
            <Route
              path="/productos/categoria/:categoryId"
              element={<ProductPage />}
            />
            <Route path="/sobre-nosotros" element={<ContactPage />} />
            <Route path="/mi-cuenta" element={<AccountPage />} />
            <Route path="/admin/dashboard" element={<AdminAccountPage />} />
            <Route path="/pago" element={<CheckoutPage />} />
            <Route path="/pago-exitoso" element={<PaymentSuccessPage />} />
            <Route path="/pago-cancelado" element={<PaymentCancelPage />} />
            <Route path="/valoracion/:orderId" element={<ReviewPage />} />
            <Route path="/valoraciones" element={<ReviewsShowcase />} />
          </Routes>
        </Box>
        <CookieBanner onVisibilityChange={setBannerVisible} />
        <Box sx={{display: {xs: "flex", md: "none"}}}>
          <MobileBottomNav />
        </Box>
      </Box>
    </CartProvider>
  );
}

export default App;
