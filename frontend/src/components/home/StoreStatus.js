import React, {useEffect, useState} from "react";
import {Box, Typography, useTheme} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {getSchedule} from "../../service/scheduleService";

const StoreStatus = () => {
  const [status, setStatus] = useState({isOpen: false, nextOpen: null});
  const theme = useTheme();

  useEffect(() => {
    const fetchSchedule = async () => {
      const schedule = await getSchedule();
      const now = new Date();
      const todayName = now
        .toLocaleDateString("es-ES", {weekday: "long"})
        .toLowerCase();
      const today = schedule.find((d) => d.weekday.toLowerCase() === todayName);

      if (!today || today.hours === "Cerrado") {
        setStatus({isOpen: false, nextOpen: findNextOpenDay(schedule)});
        return;
      }

      const [openTime, closeTime] = today.hours.split("–").map((h) => h.trim());
      const [openHour, openMinute] = openTime.split(":").map(Number);
      const [closeHour, closeMinute] = closeTime.split(":").map(Number);

      const openDate = new Date(now);
      openDate.setHours(openHour, openMinute, 0, 0);

      const closeDate = new Date(now);
      closeDate.setHours(closeHour, closeMinute, 0, 0);

      if (now >= openDate && now <= closeDate) {
        setStatus({isOpen: true, closeTime: closeTime});
      } else if (now < openDate) {
        setStatus({
          isOpen: false,
          nextOpen: {day: today.weekday, openTime: openTime},
        });
      } else {
        setStatus({isOpen: false, nextOpen: findNextOpenDay(schedule)});
      }
    };

    const findNextOpenDay = (schedule) => {
      const days = [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
      ];
      const now = new Date();
      for (let i = 1; i <= 7; i++) {
        const nextDayIdx = (now.getDay() + i) % 7;
        const nextDayName = days[nextDayIdx];
        const next = schedule.find(
          (d) =>
            d.weekday.toLowerCase() === nextDayName && d.hours !== "Cerrado"
        );
        if (next) {
          return {day: next.weekday, openTime: next.hours.split("–")[0].trim()};
        }
      }
      return null;
    };

    fetchSchedule();
  }, []);

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexDirection: {xs: "column", sm: "row"},
        textAlign: {xs: "center", sm: "left"},
      }}
    >
      {status.isOpen ? (
        <>
          <CheckCircleIcon sx={{color: "#6b8b57", fontSize: 28}} />
          <Box>
            <Typography
              variant="body1"
              sx={{fontWeight: "bold", color: "#6b8b57"}}
            >
              Estamos abiertos
            </Typography>
            {status.closeTime && (
              <Typography variant="body2" sx={{color: "#555"}}>
                Cerramos a las {status.closeTime}
              </Typography>
            )}
          </Box>
        </>
      ) : (
        <>
          <CancelIcon sx={{color: "#c62828", fontSize: 28}} />
          <Box>
            <Typography
              variant="body1"
              sx={{fontWeight: "bold", color: "#c62828"}}
            >
              Estamos cerrados
            </Typography>
            {status.nextOpen && (
              <Typography variant="body2" sx={{color: "#555"}}>
                Abrimos el {status.nextOpen.day.toLowerCase()} a las{" "}
                {status.nextOpen.openTime}
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default StoreStatus;
