import React, {useState, useEffect, useContext} from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {baseUrl} from "../../utils/constants";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {AuthContext} from "../../context/AuthContext";
import {updateUser as updateUserService} from "../../service/userService";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const phoneRegex = /^(\+34\s?)?(\d\s?){9}$/;
const emailRegex =
  /^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*(?:\.(com|net|org|edu|es))$/;

const AdminSettings = ({open, onClose, type}) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    newEmail: "",
    name: "",
    phone: "",
    facebook_url: "",
    id: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {auth, updateUser, setAuth} = useContext(AuthContext);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const loadBakeryInfo = async () => {
      if (type !== "profile" || !open) return;
      try {
        const response = await fetch(`${baseUrl}/info`);
        if (!response.ok) throw new Error("Error al cargar los datos");
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          id: data.id,
          name: data.name || "",
          phone: data.phone || "",
          facebook_url: data.facebookUrl || "",
          newEmail: data.email || "",
        }));
      } catch (err) {
        setError("Error al cargar la información de la panadería");
      }
    };
    loadBakeryInfo();
  }, [type, open]);

  useEffect(() => {
    if (open) {
      setError("");
      setSuccess("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        newEmail: "",
        name: "",
        phone: "",
        facebook_url: "",
        id: null,
      });
      setError("");
      setSuccess("");
      setFieldErrors({});
    }
  }, [open]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});

    let error = "";
    if (name === "newPassword") {
      error =
        value && !passwordRegex.test(value)
          ? "Debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo"
          : "";
      if (formData.confirmPassword && formData.confirmPassword !== value) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: "Las contraseñas no coinciden",
        }));
      } else {
        setFieldErrors((prev) => ({...prev, confirmPassword: ""}));
      }
    } else if (name === "confirmPassword") {
      error =
        value !== formData.newPassword ? "Las contraseñas no coinciden" : "";
    } else if (name === "newEmail" && !emailRegex.test(value)) {
      error = "Formato de email inválido";
    } else if (name === "phone" && value && !phoneRegex.test(value)) {
      error = "Formato de teléfono no válido. Ej: +34 954 90 13 85";
    }

    setFieldErrors((prev) => ({...prev, [name]: error}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (type === "password") {
        if (formData.newPassword !== formData.confirmPassword) {
          setError("Las contraseñas no coinciden");
          return;
        }
        if (!passwordRegex.test(formData.newPassword)) {
          setError(
            "La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo"
          );
          return;
        }

        try {
          await updateUserService(
            {
              oldPassword: formData.currentPassword,
              password: formData.newPassword,
            },
            auth.token
          );

          setSuccess("Contraseña actualizada correctamente");
          setTimeout(() => onClose(), 2000);
        } catch (err) {
          if (
            err.message === "No se pudo actualizar el usuario" ||
            err.message.toLowerCase().includes("contraseña")
          ) {
            setFieldErrors((prev) => ({
              ...prev,
              currentPassword: "La contraseña actual no es correcta",
            }));
          } else {
            setError(err.message || "Error desconocido");
          }
        }
      } else if (type === "email") {
        if (!emailRegex.test(formData.newEmail)) {
          setError("Email no válido");
          return;
        }

        await updateUserService({email: formData.newEmail}, auth.token);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        };

        await fetch(`${baseUrl}/info/${formData.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            email: formData.newEmail,
          }),
        });

        const updatedUser = await fetch(`${baseUrl}/users/me`, {headers}).then(
          (res) => res.json()
        );
        setAuth((prev) => ({...prev, user: updatedUser}));

        setSuccess("Email actualizado correctamente");
        setTimeout(() => onClose(), 2000);
      } else if (type === "profile") {
        if (!formData.name.trim()) {
          setError("El nombre no puede estar vacío");
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        };

        await fetch(`${baseUrl}/info/${formData.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            facebookUrl: formData.facebook_url,
          }),
        });

        await updateUser(
          {
            name: formData.name,
            phoneNumber: formData.phone,
          },
          auth.token
        );

        const updatedUser = await fetch("/users/me", {headers}).then((res) =>
          res.json()
        );

        setAuth((prev) => ({...prev, user: updatedUser}));
        setSuccess("Perfil actualizado correctamente");
        setTimeout(() => onClose(), 2000);
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar los cambios");
    }
  };

  const getTextFieldStyle = () => ({
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#8DBB01",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#8DBB01",
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {type === "password"
          ? "Cambiar Contraseña"
          : type === "email"
          ? "Cambiar Email"
          : "Editar Perfil"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{mb: 2}}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{mb: 2}}>
              {success}
            </Alert>
          )}

          {type === "password" && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Contraseña actual"
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                sx={getTextFieldStyle(formData.currentPassword)}
                required
                error={!!fieldErrors.currentPassword}
                helperText={fieldErrors.currentPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        edge="end"
                      >
                        {showPassword.current ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Nueva contraseña"
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                error={!!fieldErrors.newPassword}
                helperText={fieldErrors.newPassword}
                sx={getTextFieldStyle(
                  formData.newPassword,
                  passwordRegex.test(formData.newPassword)
                )}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword((prev) => ({...prev, new: !prev.new}))
                        }
                        edge="end"
                      >
                        {showPassword.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Confirmar nueva contraseña"
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                sx={getTextFieldStyle(
                  formData.confirmPassword,
                  formData.confirmPassword === formData.newPassword
                )}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        edge="end"
                      >
                        {showPassword.confirm ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}

          {type === "email" && (
            <TextField
              fullWidth
              margin="normal"
              label="Nuevo email"
              type="email"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleChange}
              error={!!fieldErrors.newEmail}
              helperText={fieldErrors.newEmail}
              sx={getTextFieldStyle(formData.newEmail)}
              required
            />
          )}

          {type === "profile" && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={getTextFieldStyle(formData.name)}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone}
                sx={getTextFieldStyle(
                  formData.phone,
                  phoneRegex.test(formData.phone)
                )}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Facebook URL"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleChange}
                sx={getTextFieldStyle(formData.facebook_url)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            sx={{bgcolor: "#8DBB01", "&:hover": {bgcolor: "#7aa300"}}}
          >
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminSettings;
