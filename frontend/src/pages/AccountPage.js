import React, {useState, useEffect, useContext} from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Container,
  Alert,
  Drawer,
  CircularProgress,
} from "@mui/material";

import AccountSidebar, {
  SidebarContent,
} from "../components/account/AccountSidebar";
import {useSearchParams} from "react-router-dom";
import OrdersTabs from "../components/account/OrdersTabs";
import AccountSettingsForm from "../components/account/AccountSettingsForm";
import {AuthContext} from "../context/AuthContext";
import {getCurrentUser, updateUser} from "../service/userService";
import {getMyOrders} from "../service/orderService";
import useMediaQuery from "@mui/material/useMediaQuery";
import Snackbar from "@mui/material/Snackbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {useTheme} from "@mui/material/styles";

const AccountPage = () => {
  const [selected, setSelected] = useState(0);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {auth, updateUser: updateAuthUser, loginAuth} = useContext(AuthContext);

  const token = auth?.token;
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "configuracion") setSelected(1);
    else setSelected(0);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("🔐 token actual:", token);

      try {
        setLoading(true);
        setError(null);
        const userData = await getCurrentUser(token);
        const ordersData = await getMyOrders(token, userData.id);
        setUser(userData);
        setOrders(ordersData);
      } catch (err) {
        setError(
          "Error al cargar los datos. Por favor, intenta de nuevo más tarde."
        );
        setUser(null);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleSave = async (userUpdateData) => {
    try {
      setLoading(true);

      const isUnchanged =
        userUpdateData.name === user.name &&
        userUpdateData.surname === user.surname &&
        userUpdateData.email === user.email &&
        userUpdateData.phoneNumber === (user.phoneNumber || "") &&
        !userUpdateData.password;

      if (isUnchanged) {
        setSnackbar({
          open: true,
          message: "No hiciste ningún cambio.",
          severity: "info",
        });
        setLoading(false);
        return;
      }

      const response = await updateUser(userUpdateData, token);

      if (response.emailChanged && response.newToken) {
        loginAuth(response.newToken, response.user);
        setUser(response.user);

        setSnackbar({
          open: true,
          message: "Datos actualizados correctamente.",
          severity: "success",
        });

        console.log("🔄 Email changed, new token applied:", response.newToken);
      } else {
        const userData = await getCurrentUser(token);
        setUser(userData);
        updateAuthUser(userData);

        setSnackbar({
          open: true,
          message: "Datos actualizados correctamente",
          severity: "success",
        });
      }
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      setSnackbar({
        open: true,
        message: err.message || "Error al actualizar los datos",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
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
      </>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{mt: 4}}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{mt: 2, px: {xs: 0, md: 4}}}>
      <Box
        sx={{
          display: "flex",
          flexDirection: {xs: "column", md: "row"},
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        {!isMobile ? (
          <Drawer
            variant="permanent"
            sx={{
              width: 240,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: 240,
                boxSizing: "border-box",
                bgcolor: "#fdf6ec",
                borderRight: "1px solid #e0e0e0",
                top: "64px",
                height: "calc(100vh - 64px)",
              },
            }}
          >
            <SidebarContent
              user={user}
              selected={selected}
              onSelect={setSelected}
            />
          </Drawer>
        ) : null}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: isMobile ? "auto" : "visible",
            pb: isMobile ? 8 : 0,
          }}
        >
          {selected === 0 && (
            <OrdersTabs orders={orders} setOrders={setOrders} />
          )}
          {selected === 1 && (
            <AccountSettingsForm
              user={user}
              onSave={handleSave}
              loading={loading}
            />
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{vertical: "bottom", horizontal: "center"}}
      >
        <Alert severity={snackbar.severity} sx={{width: "100%"}}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AccountPage;
