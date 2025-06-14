import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router-dom";
import {
  Dialog,
  DialogContent,
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MuiAlert from "@mui/material/Alert";
import logo from "../../assets/logos/2.png";
import Slide from "@mui/material/Slide";
import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext";
import {getCurrentUser} from "../../service/userService";

const SlideTransition = (props) => {
  return <Slide {...props} direction="left" />;
};
const Login = ({open, onClose}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const fromRegister = location.state?.fromRegister;
  const [authError, setAuthError] = useState("");
  const [openRegisterSnackbar, setOpenRegisterSnackbar] = useState(false);
  const [openLoginSnackbar, setOpenLoginSnackbar] = useState(false);
  const {loginAuth} = useContext(AuthContext);
  const [openLogoutSnackbar, setOpenLogoutSnackbar] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");

  const navigate = useNavigate();
  const inputFocusStyle = {
    "& .MuiOutlinedInput-root.Mui-focused": {
      "& fieldset": {borderColor: "#8DBB01"},
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#8DBB01",
    },
    "& .MuiOutlinedInput-root.Mui-error fieldset": {
      borderColor: "#d32f2f",
    },
    "& .MuiInputLabel-root.Mui-error": {
      color: "#d32f2f",
    },
  };

  useEffect(() => {
    if (open) {
      const reason = sessionStorage.getItem("redirectReason");
      if (reason === "cart") {
        setRedirectMessage("Debes iniciar sesión para proceder al pago.");
        sessionStorage.removeItem("redirectReason");
      } else {
        setRedirectMessage("");
      }
    }
  }, [open]);

  useEffect(() => {
    if (fromRegister) setOpenRegisterSnackbar(true);
    if (location.state?.fromLogout) {
      setOpenLogoutSnackbar(true);
      window.history.replaceState(null, "", location.pathname);
    }
  }, [fromRegister, location]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!email || !password) {
      setAuthError("Debes completar todos los campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError("Introduce un email válido.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
      });

      if (!response.ok) {
        setAuthError("Email o contraseña incorrectos.");
        return;
      }

      const data = await response.json();
      const userData = await getCurrentUser(data.token);

      loginAuth(data.token, userData);

      console.log("Usuario logueado:", data.user);

      setOpenLoginSnackbar(true);
      onClose();
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setAuthError("Email o contraseña incorrectos.");
    }
  };
  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setAuthError("");
    }
  }, [open]);

  const handleCloseRegisterSnackbar = () => setOpenRegisterSnackbar(false);
  const handleCloseLoginSnackbar = () => setOpenLoginSnackbar(false);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(5px)",
            overflow: "visible",
          },
        }}
      >
        <DialogContent
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pb: 4,
            pt: {xs: 12, sm: 20},
          }}
        >
          {redirectMessage && (
            <Alert severity="info" sx={{mb: 2}}>
              {redirectMessage}
            </Alert>
          )}

          <Box
            component="img"
            src={logo}
            alt="Panadería Ana"
            sx={{
              height: {xs: 150, sm: 250},
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />

          <IconButton
            onClick={onClose}
            sx={{position: "absolute", top: 8, right: 8}}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Merriweather', serif",
              fontWeight: "bold",
              mb: 3,
              textAlign: "center",
            }}
          >
            Iniciar sesión
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{width: "100%"}}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              sx={inputFocusStyle}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              sx={inputFocusStyle}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{color: "text.secondary"}}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#b6ba91",
                "&:hover": {backgroundColor: "#a0a482"},
                fontWeight: "bold",
                fontSize: "1rem",
                py: 1,
                borderRadius: 2,
              }}
            >
              Entrar
            </Button>

            {authError && (
              <Typography
                variant="body2"
                color="error"
                sx={{
                  mt: 2,
                  textAlign: "center",
                  backgroundColor: "rgba(255,0,0,0.05)",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                {authError}
              </Typography>
            )}
          </Box>

          <Typography variant="body2" sx={{mt: 3, color: "#333"}}>
            ¿No tienes cuenta?{" "}
            <Button
              variant="text"
              size="small"
              sx={{
                color: "#8a8c63",
                fontWeight: "bold",
                textTransform: "none",
                textDecoration: "none",
                "&:hover": {textDecoration: "underline"},
              }}
              onClick={() => {
                onClose();
                navigate("/register");
              }}
            >
              Regístrate
            </Button>
          </Typography>
          <Typography
            variant="body2"
            sx={{mt: 2, color: "#333", textAlign: "center"}}
          >
            <Button
              variant="text"
              size="small"
              sx={{
                color: "#8a8c63",
                fontWeight: "bold",
                textTransform: "none",
                textDecoration: "none",
                "&:hover": {textDecoration: "underline"},
              }}
              onClick={() => {
                onClose();
                navigate("/forgot-password");
              }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </Typography>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openRegisterSnackbar}
        onClose={handleCloseRegisterSnackbar}
        autoHideDuration={4000}
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        TransitionComponent={SlideTransition}
      >
        <MuiAlert
          onClose={handleCloseRegisterSnackbar}
          severity="success"
          variant="filled"
          sx={{borderRadius: 2}}
        >
          Registro completado, debe iniciar sesión.
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={openLoginSnackbar}
        onClose={handleCloseLoginSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        TransitionComponent={SlideTransition}
      >
        <MuiAlert
          onClose={handleCloseLoginSnackbar}
          severity="success"
          variant="filled"
          sx={{borderRadius: 2, mb: 2}}
        >
          Inicio de sesión exitoso.
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={openLogoutSnackbar}
        onClose={() => setOpenLogoutSnackbar(false)}
        autoHideDuration={3000}
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        TransitionComponent={SlideTransition}
      >
        <MuiAlert
          onClose={() => setOpenLogoutSnackbar(false)}
          severity="info"
          variant="filled"
          sx={{borderRadius: 2, mb: 2}}
        >
          Sesión cerrada correctamente.
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default Login;
