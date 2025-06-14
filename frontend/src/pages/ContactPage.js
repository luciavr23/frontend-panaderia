import React, {useEffect, useState, useContext} from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  InputBase,
  Alert,
  Switch,
  TextField,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {getContactInfo} from "../service/contactService";
import {CLOUDINARY_BASE_URL} from "../service/cloudinaryService";
import {AuthContext} from "../context/AuthContext";
import EditBakeryInfoModal from "../components/contact/EditBakeryInfoModal";
import Footer from "../components/Footer";
import {getSchedule} from "../service/scheduleService";
import {FormHelperText} from "@mui/material";
import {updateSchedule} from "../service/scheduleService";

const emailRegex =
  /^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*(?:\.(com|net|org|edu|es))$/;

const ContactPage = () => {
  const [info, setInfo] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form, setForm] = useState({name: "", email: "", message: ""});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const {auth} = useContext(AuthContext);
  const isAdmin = auth?.user?.role?.toUpperCase() === "ADMIN";
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const token = auth?.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContactInfo();
        const scheduleData = await getSchedule();
        setInfo(data);
        setSchedule(scheduleData);
      } catch (err) {
        console.error("Error al cargar info de contacto:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleUpdateSchedule = async (id, updatedData) => {
    try {
      console.log("TOKEN ENVIADO:", token);

      const updated = await updateSchedule(id, updatedData, token);
      setSchedule((prev) =>
        prev.map((s) => (s.id === id ? {...s, ...updated} : s))
      );
    } catch (err) {
      console.error("Error al actualizar horario:", err);
    }
  };

  const fetchUpdatedInfo = async () => {
    const updated = await getContactInfo();
    setInfo(updated);
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setForm({...form, [name]: value});

    if (name === "email") {
      if (!value) {
        setErrors((prev) => ({...prev, email: "El correo es obligatorio."}));
      } else if (!emailRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Correo inválido",
        }));
      } else {
        setErrors((prev) => ({...prev, email: ""}));
      }
    } else if (name === "name") {
      if (!value.trim()) {
        setErrors((prev) => ({...prev, name: "El nombre es obligatorio."}));
      } else {
        setErrors((prev) => ({...prev, name: ""}));
      }
    } else if (name === "message") {
      if (!value.trim()) {
        setErrors((prev) => ({
          ...prev,
          message: "El mensaje no puede estar vacío.",
        }));
      } else {
        setErrors((prev) => ({...prev, message: ""}));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!form.email) newErrors.email = "El correo es obligatorio.";
    else if (!emailRegex.test(form.email))
      newErrors.email =
        "Correo inválido. Debe ser .com, .net, .org, .edu o .es";
    if (!form.message.trim())
      newErrors.message = "El mensaje no puede estar vacío.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;

    setIsSending(true);
    try {
      await fetch("/info/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form),
      });
      setSuccess(true);
      setForm({name: "", email: "", message: ""});
      setErrors({});
      setSubmitted(false);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {!loading && info && (
        <Box
          sx={{
            display: "flex",
            bgcolor: "#fefaf3",
            py: {xs: 2, md: 0},
            px: 0,
            flexDirection: {xs: "column", md: "row"},
            alignItems: "stretch",
            height: {xs: "auto", md: "calc(100vh - 64px)"},
            overflow: {xs: "visible", md: "hidden"},
            width: {xs: "100vw", md: "100%"},
            maxWidth: {xs: "100vw", md: "100%"},
            overflowX: {xs: "hidden", md: "visible"},
          }}
        >
          <Box
            sx={{
              bgcolor: "#E1E5C9",
              color: "black",
              px: {xs: 2, sm: 4},
              py: {xs: 3, sm: 6},
              width: {xs: "100%", md: "35%"},
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
              minHeight: {xs: "auto", md: "100%"},
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                fontSize: {xs: "2rem", sm: "2.5rem", md: "3rem"},
                lineHeight: 1.2,
                letterSpacing: "-1px",
                mb: 3,
              }}
            >
              Sobre Nosotros
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                width: {xs: "95vw", sm: "100%"},
                maxWidth: {xs: "100%", sm: "100%"},
                boxSizing: "border-box",
                overflowWrap: "break-word",
              }}
            >
              Desde nuestros inicios, hemos apostado por la tradición y la
              calidad. Somos más que una panadería: somos una familia dedicada a
              ofrecer productos artesanales, hechos con cariño.
            </Typography>
            {isAdmin && (
              <Button
                variant="contained"
                onClick={() => setIsEditModalOpen(true)}
                sx={{
                  bgcolor: "white",
                  color: "#8DBB01",
                  textTransform: "none",
                  fontWeight: 500,
                  mt: 2,
                  mr: {xs: 3, sm: 0},
                  "&:hover": {bgcolor: "#f4fbe6"},
                }}
              >
                Editar información
              </Button>
            )}
          </Box>

          <Box
            sx={{
              width: {xs: "100%", md: "65%"},
              py: {xs: 2, md: 4},
              px: {xs: 1, sm: 3},
              overflowY: {xs: "visible", md: "auto"},
              pr: {xs: 0, md: 2},
              boxSizing: "border-box",
            }}
          >
            <Box
              component="img"
              src={`${CLOUDINARY_BASE_URL}${info.imageUrl}`}
              alt="fachada"
              sx={{
                width: {xs: "98%", sm: "100%"},
                height: {xs: 160, sm: 200, md: 240},
                objectFit: "cover",
                borderRadius: 3,
                boxShadow: 2,
                mb: 4,
                filter: "grayscale(100%)",
                transition: "transform 0.6s ease",
              }}
            />
            <Typography variant="body1" sx={{mb: 4, color: "#444"}}>
              Nuestra panadería, situada en el corazón de Sevilla, destaca por
              su compromiso con lo artesanal y la cercanía. Ofrecemos una
              experiencia cálida con productos elaborados con esmero y
              tradición.
            </Typography>
            <Box sx={{mt: 3, mb: 2}}>
              <Typography variant="body2" sx={{color: "#555"}}>
                Más de 50 años de historia avalan nuestro saber hacer. Cada
                producto que sale de nuestro horno lleva consigo el legado de
                generaciones dedicadas al buen pan.
              </Typography>
            </Box>
            <Box sx={{mt: 4, mb: 2}} display="flex" alignItems="center" gap={1}>
              <InfoOutlinedIcon fontSize="small" sx={{color: "#888"}} />
              <Typography variant="body2" sx={{color: "#555"}}>
                Actualmente no realizamos envíos a domicilio. Todos los pedidos
                deben recogerse en tienda.
              </Typography>
            </Box>
            <Typography variant="h6" sx={{fontWeight: 600, mb: 2}} gutterBottom>
              Contacto
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOnIcon sx={{mr: 1, color: "#8DBB01"}} />
              <Typography>
                {info.street}, {info.province}, {info.city}, {info.postalCode}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon sx={{mr: 1, color: "#8DBB01"}} />
              <Typography>
                <a
                  href={`tel:${info.phone}`}
                  style={{color: "inherit", textDecoration: "underline"}}
                >
                  {info.phone}
                </a>
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={4}>
              <EmailIcon sx={{mr: 1, color: "#8DBB01"}} />
              <Typography>
                <a
                  href={`mailto:${info.email}`}
                  style={{color: "inherit", textDecoration: "underline"}}
                >
                  {info.email}
                </a>
              </Typography>
            </Box>
            <Box sx={{mt: 4}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Horario
              </Typography>
              <Box
                sx={{
                  overflowX: {xs: "auto", md: "visible"},
                  minWidth: {xs: 320, sm: 0},
                  maxWidth: "100%",
                }}
              >
                {schedule.map((item) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: {xs: "flex-start", md: "space-between"},
                      alignItems: "center",
                      borderBottom: "1px solid #ddd",
                      py: 0.8,
                      gap: {xs: 0.5, md: 2},
                    }}
                  >
                    <Typography
                      sx={{
                        minWidth: 100,
                        color: "#444",
                        fontWeight: 500,
                        ml: {xs: 1.5, md: 0},
                      }}
                    >
                      {item.weekday}
                    </Typography>

                    {isAdmin ? (
                      item.closed ? (
                        <Typography color="text.secondary">Cerrado</Typography>
                      ) : (
                        <Box
                          sx={{display: "flex", alignItems: "center", gap: 1}}
                        >
                          <TextField
                            type="time"
                            size="small"
                            value={item.openTime}
                            onChange={(e) =>
                              handleUpdateSchedule(item.id, {
                                ...item,
                                openTime: e.target.value,
                              })
                            }
                            sx={{minWidth: 100}}
                            inputProps={{step: 300}}
                          />

                          <Typography>–</Typography>
                          <TextField
                            type="time"
                            size="small"
                            value={item.closeTime}
                            onChange={(e) =>
                              handleUpdateSchedule(item.id, {
                                ...item,
                                closeTime: e.target.value,
                              })
                            }
                            sx={{minWidth: 100}}
                            inputProps={{step: 300}}
                          />
                        </Box>
                      )
                    ) : (
                      <Typography color="text.secondary">
                        {item.closed
                          ? "Cerrado"
                          : `${item.openTime} - ${item.closeTime}`}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{mt: 4}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Redes Sociales
              </Typography>
              <Box sx={{display: "flex", gap: 2}}>
                {info.facebookUrl && (
                  <Button
                    variant="text"
                    href={info.facebookUrl}
                    startIcon={<FacebookIcon />}
                    target="_blank"
                  >
                    Facebook
                  </Button>
                )}
                <Button
                  variant="text"
                  href="https://www.toogoodtogo.com/es"
                  startIcon={<ShoppingBagIcon />}
                  target="_blank"
                >
                  TooGoodToGo
                </Button>
              </Box>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                width: "100%",
                maxWidth: {xs: 340, sm: 700, md: 800},
                mt: 1,
                mb: 2,
                px: {xs: 0, sm: 4, md: 0},
                py: {xs: 3, sm: 4, md: 5},
                boxSizing: "border-box",

                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Resuelve tus dudas
              </Typography>

              <Box>
                <TextField
                  fullWidth
                  placeholder="Enter your Name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8f9fa",
                      borderRadius: 1,
                      fontSize: {xs: 14, sm: 16},
                      "& fieldset": {
                        borderColor: "#e9ecef",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ced4da",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8DBB01",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      py: {xs: 2, sm: 2.5},
                      px: 3,
                    },
                  }}
                  inputProps={{maxLength: 100}}
                />
                {submitted && errors.name && (
                  <FormHelperText error sx={{mt: 0.5, ml: 0}}>
                    {errors.name}
                  </FormHelperText>
                )}
              </Box>

              <Box>
                <TextField
                  fullWidth
                  placeholder="Enter a valid email address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8f9fa",
                      borderRadius: 1,
                      fontSize: {xs: 14, sm: 16},
                      "& fieldset": {
                        borderColor: "#e9ecef",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ced4da",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8DBB01",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      py: {xs: 2, sm: 2.5},
                      px: 3,
                    },
                  }}
                  inputProps={{maxLength: 100}}
                  error={Boolean(errors.email)}
                />
                {(submitted || form.email) && errors.email && (
                  <FormHelperText error sx={{mt: 0.5, ml: 0}}>
                    {errors.email}
                  </FormHelperText>
                )}
              </Box>

              <Box>
                <TextField
                  fullWidth
                  placeholder="Enter your message"
                  name="message"
                  value={form.message}
                  multiline
                  rows={4}
                  onChange={(e) => {
                    if (e.target.value.length <= 250) handleInputChange(e);
                  }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8f9fa",
                      borderRadius: 1,
                      fontSize: {xs: 14, sm: 16},
                      "& fieldset": {
                        borderColor: "#e9ecef",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ced4da",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8DBB01",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      py: {xs: 1.5, sm: 2},
                      px: 2,
                    },
                  }}
                  inputProps={{maxLength: 250}}
                />
                <Box display="flex" justifyContent="flex-end" sx={{mt: 0.5}}>
                  <Typography
                    variant="caption"
                    color={
                      form.message.length >= 250 ? "error" : "textSecondary"
                    }
                  >
                    {form.message.length}/250
                  </Typography>
                </Box>
                {submitted && errors.message && (
                  <FormHelperText error sx={{mt: 0.5, ml: 0}}>
                    {errors.message}
                  </FormHelperText>
                )}
              </Box>

              <Button
                type="submit"
                disabled={isSending}
                sx={{
                  py: {xs: 1.5, sm: 1},
                  px: 4,
                  fontSize: {xs: 12, sm: 14},
                  textTransform: "none",
                  backgroundColor: "#6c757d",
                  color: "white",
                  borderRadius: 1,
                  fontWeight: 400,
                  alignSelf: "flex-start",
                  minWidth: {xs: 120, sm: 140},
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#5a6268",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  },
                  "&:disabled": {
                    backgroundColor: "#adb5bd",
                    color: "white",
                  },
                }}
              >
                {isSending ? "Enviando..." : "Enviar"}
              </Button>

              {success && (
                <Alert
                  severity="success"
                  sx={{
                    mt: 2,
                    borderRadius: 1,
                    "& .MuiAlert-message": {
                      fontSize: {xs: 14, sm: 16},
                    },
                  }}
                >
                  Mensaje enviado correctamente.
                </Alert>
              )}
            </Box>

            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{
                mt: 4,
                mb: 1.5,
                fontSize: {xs: 16, sm: 18},
                display: {xs: "block"},
              }}
            >
              Ubicación
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: {xs: "95vw", sm: "100%"},
                maxWidth: 500,
                height: {xs: 180, sm: 250, md: 300},
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 3,
                mt: 0,
                mx: {xs: "auto", sm: 0},
              }}
            >
              {!mapLoaded && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "rgba(255,255,255,0.7)",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress sx={{color: "#8DBB01"}} />
                </Box>
              )}
              <iframe
                title="Ubicación Google Maps"
                src={
                  info.location_url ||
                  `https://www.google.com/maps?q=${encodeURIComponent(
                    info.street + ", " + info.city
                  )}&output=embed`
                }
                width="100%"
                height="100%"
                style={{border: 0}}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapLoaded(true)}
              />
            </Box>
            <EditBakeryInfoModal
              open={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              info={info}
              onUpdate={fetchUpdatedInfo}
            />
          </Box>
        </Box>
      )}

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
          <style>
            {`@keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }`}
          </style>
        </Box>
      )}

      <Footer />
    </>
  );
};

export default ContactPage;
