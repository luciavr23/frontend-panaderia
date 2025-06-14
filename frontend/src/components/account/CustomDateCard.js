import {Box, Typography, Paper} from "@mui/material";
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {es} from "date-fns/locale";

export default function CustomDateCard({date}) {
  const validDate =
    date instanceof Date && !isNaN(date.getTime()) ? date : new Date();

  return (
    <Paper
      sx={{
        display: "flex",
        width: 500,
        mx: "auto",
        mt: 4,
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          width: 180,
          backgroundColor: "#f44336",
          color: "#fff",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        }}
      >
        <Typography variant="subtitle2" sx={{fontSize: "0.9rem"}}>
          {validDate.toLocaleDateString("es-ES", {weekday: "long"})}
        </Typography>
        <Typography variant="h2" sx={{fontSize: "4rem", fontWeight: 700}}>
          {validDate.getDate()}
        </Typography>
        <Typography variant="body2" sx={{fontSize: "1rem"}}>
          {validDate.toLocaleDateString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          p: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Calendar
          value={validDate}
          locale="es-ES"
          view="month"
          tileDisabled={() => true}
          navigation={({date, view, label, locale}) => null}
          showNeighboringMonth={false}
          className="small-calendar-display"
        />
      </Box>
    </Paper>
  );
}

```css
.small-calendar-display .react-calendar__navigation,
.small-calendar-display .react-calendar__month-view__weekdays__weekday,
.small-calendar-display .react-calendar__tile,
.small-calendar-display .react-calendar__month-view__days__day {
  font-size: 0.8rem; 
}

.small-calendar-display .react-calendar__month-view__days__day {
  padding: 0.2em; 
}

.small-calendar-display .react-calendar__tile--now {
    background-color: #ffff76; 
}

.small-calendar-display .react-calendar__tile--active {
    background-color: transparent !important; 
    color: inherit !important;
}
```;
