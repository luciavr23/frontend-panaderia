import React, {useEffect, useState} from "react";
import {Typography, Box, Stack} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {getSchedule} from "../../service/scheduleService";

function Schedule() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    getSchedule().then(setSchedule);
  }, []);

  return (
    <Box sx={{mb: 4}}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AccessTimeIcon sx={{color: "#8DBB01"}} />
        <Typography variant="h6" fontWeight="bold">
          Horario
        </Typography>
      </Box>
      <Stack spacing={1}>
        {schedule.map((item) => (
          <Box
            key={item.weekday}
            display="flex"
            justifyContent="space-between"
            sx={{borderBottom: "1px solid #ddd", pb: 0.5}}
          >
            <Typography>{item.weekday}</Typography>
            <Typography color="text.secondary">{item.hours}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default Schedule;
