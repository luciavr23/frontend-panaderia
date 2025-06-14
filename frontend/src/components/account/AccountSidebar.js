import React, {useContext, useState} from "react";
import {useTheme, useMediaQuery} from "@mui/material";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Drawer,
} from "@mui/material";
import {AuthContext} from "../../context/AuthContext";

function stringAvatar(name = "") {
  const [first, second] = name.split(" ");

  return {
    children: `${first?.[0] || ""}${second?.[0] || ""}`.toUpperCase(),
    sx: {
      bgcolor: "#8DBB01",
      color: "#fff",
      width: 70,
      height: 70,
      fontSize: 32,
      fontWeight: 700,
    },
  };
}

const SidebarContent = ({user, selected, onSelect}) => (
  <Box
    sx={{
      bgcolor: "#fdf6ec",
      height: {xs: "100%", md: "calc(100vh - 32px)"},
      p: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderRight: {md: "1px solid #ddd"},
      boxSizing: "border-box",
      position: {md: "sticky"},
      top: {md: 24},
      zIndex: 1,
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: {xs: 0, md: 4},
        width: "100%",
        position: "relative",
      }}
    >
      <Box sx={{mb: 1}}>
        {user.profileImage ? (
          <Avatar
            src={user.profileImage}
            sx={{
              width: 70,
              height: 70,
              border: "2px solid #8DBB01",
            }}
          />
        ) : (
          <Avatar {...stringAvatar(`${user.name} ${user.surname}`)} />
        )}
      </Box>
      <Typography
        variant="h6"
        sx={{mt: 1, fontWeight: 600, textAlign: "center", width: "100%"}}
      >
        {user.name} {user.surname}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{mb: 1, textAlign: "center", width: "100%"}}
      >
        CLIENTE
      </Typography>
    </Box>

    <List sx={{width: "100%"}}>
      <ListItem disablePadding>
        <ListItemButton
          selected={selected === 0}
          onClick={() => onSelect(0)}
          sx={{
            borderRadius: 2,
            mb: 1,
            "&.Mui-selected": {
              bgcolor: "#8DBB01",
              color: "#fff",
              "& .MuiListItemText-primary": {
                color: "#fff",
                fontWeight: 700,
              },
            },
            "&.Mui-selected:hover": {
              bgcolor: "#E1E5C9",
              color: "#8DBB01",
              "& .MuiListItemText-primary": {
                color: "#8DBB01",
              },
            },
          }}
        >
          <ListItemText
            primary="Mis pedidos"
            primaryTypographyProps={{fontWeight: selected === 0 ? 700 : 400}}
          />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          selected={selected === 1}
          onClick={() => onSelect(1)}
          sx={{
            borderRadius: 2,
            "&.Mui-selected": {
              bgcolor: "#8DBB01",
              color: "#fff",
              "& .MuiListItemText-primary": {
                color: "#fff",
                fontWeight: 700,
              },
            },
            "&.Mui-selected:hover": {
              bgcolor: "#E1E5C9",
              color: "#8DBB01",
              "& .MuiListItemText-primary": {
                color: "#8DBB01",
              },
            },
          }}
        >
          <ListItemText
            primary="Configuración"
            primaryTypographyProps={{fontWeight: selected === 1 ? 700 : 400}}
          />
        </ListItemButton>
      </ListItem>
    </List>
  </Box>
);

const AccountSidebar = ({
  user,
  selected,
  onSelect,
  mobileOpen,
  onDrawerToggle,
}) => {
  const {auth} = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!user) {
    return (
      <Box
        sx={{
          width: {xs: "100%", md: 240},
          bgcolor: "#f6f6ed",
          height: {xs: "auto", md: "100vh"},
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={onDrawerToggle}
        PaperProps={{sx: {width: 240}}}
      >
        <SidebarContent user={user} selected={selected} onSelect={onSelect} />
      </Drawer>
    );
  }

  return <SidebarContent user={user} selected={selected} onSelect={onSelect} />;
};

export default AccountSidebar;
export {SidebarContent};
