import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InfoIcon from "@mui/icons-material/Info";
import StarIcon from "@mui/icons-material/Star";
import {useNavigate, useLocation} from "react-router-dom";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const routeToIndex = {
    "/": 0,
    "/productos": 1,
    "/valoraciones": 2,
    "/sobre-nosotros": 3,
  };

  const indexToRoute = {
    0: "/",
    1: "/productos",
    2: "/valoraciones",
    3: "/sobre-nosotros",
  };

  const currentValue = routeToIndex[location.pathname];

  const handleChange = (event, newValue) => {
    navigate(indexToRoute[newValue]);
  };

  const activeColor = "#8DBB01";

  return (
    <BottomNavigation
      value={currentValue ?? false}
      onChange={handleChange}
      showLabels
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        bgcolor: "#fefaf1",
        borderTop: "1px solid #ddd",
      }}
    >
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon />}
        sx={{
          "&.Mui-selected": {color: activeColor},
        }}
      />
      <BottomNavigationAction
        label="Productos"
        icon={<StorefrontIcon />}
        sx={{
          "&.Mui-selected": {color: activeColor},
        }}
      />
      <BottomNavigationAction
        label="Valoraciones"
        icon={<StarIcon />}
        sx={{
          "&.Mui-selected": {color: activeColor},
        }}
      />
      <BottomNavigationAction
        label="Contacto"
        icon={<InfoIcon />}
        sx={{
          "&.Mui-selected": {color: activeColor},
        }}
      />
    </BottomNavigation>
  );
};

export default MobileBottomNav;
