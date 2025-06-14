import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Person as PersonIcon,
  Lock as LockIcon,
  BarChart as StatsIcon,
} from "@mui/icons-material";

const AdminSidebar = ({selected, onSelect, user, onSettingsSelect}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleSettingsSelect = (type) => {
    onSettingsSelect(type);
    setSettingsOpen(false);
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      sx={{
        width: 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          bgcolor: "#fff",
          borderRight: "1px solid #e0e0e0",
          position: "fixed",
          left: 0,
          top: "64px",
          height: "calc(100vh - 64px)",
          overflowX: "hidden",
          zIndex: 1200,
          "&:hover": {
            overflowX: "auto",
          },
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#8DBB01",
            borderRadius: "3px",
          },
        },
      }}
    >
      <Box
        sx={{p: 2, display: "flex", flexDirection: "column", height: "100%"}}
      >
        <Box sx={{display: "flex", alignItems: "center", mb: 3}}>
          <Avatar
            src={user?.profileImage}
            sx={{width: 56, height: 56, mr: 2}}
          />
          <Box>
            <Typography variant="subtitle1" sx={{fontWeight: 600}}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administrador
            </Typography>
          </Box>
        </Box>

        <Divider sx={{mb: 2}} />

        <List sx={{flexGrow: 1}}>
          <ListItem
            button
            selected={selected === "dashboard"}
            onClick={() => onSelect("dashboard")}
            sx={{
              borderRadius: 1,
              mb: 1,
              "&.Mui-selected": {
                bgcolor: "#8DBB0115",
                "&:hover": {bgcolor: "#8DBB0125"},
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon
                sx={{color: selected === "dashboard" ? "#8DBB01" : "inherit"}}
              />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem
            button
            selected={selected === "orders"}
            onClick={() => onSelect("orders")}
            sx={{
              borderRadius: 1,
              mb: 1,
              "&.Mui-selected": {
                bgcolor: "#8DBB0115",
                "&:hover": {bgcolor: "#8DBB0125"},
              },
            }}
          >
            <ListItemIcon>
              <OrdersIcon
                sx={{color: selected === "orders" ? "#8DBB01" : "inherit"}}
              />
            </ListItemIcon>
            <ListItemText primary="Pedidos" />
          </ListItem>

          <ListItem
            button
            selected={selected === "stats"}
            onClick={() => onSelect("stats")}
            sx={{
              borderRadius: 1,
              mb: 1,
              "&.Mui-selected": {
                bgcolor: "#8DBB0115",
                "&:hover": {bgcolor: "#8DBB0125"},
              },
            }}
          >
            <ListItemIcon>
              <StatsIcon
                sx={{color: selected === "stats" ? "#8DBB01" : "inherit"}}
              />
            </ListItemIcon>
            <ListItemText primary="Estadísticas" />
          </ListItem>

          <ListItem
            button
            onClick={handleSettingsClick}
            sx={{
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Configuración" />
            {settingsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                onClick={() => handleSettingsSelect("profile")}
                sx={{pl: 4}}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Editar Perfil" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleSettingsSelect("password")}
                sx={{pl: 4}}
              >
                <ListItemIcon>
                  <LockIcon />
                </ListItemIcon>
                <ListItemText primary="Cambiar Contraseña" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
