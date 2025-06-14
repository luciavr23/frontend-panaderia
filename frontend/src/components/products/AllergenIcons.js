import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

const AllergenIcons = ({allergens}) => (
  <Box
    sx={{
      display: "flex",
      flexWrap: {xs: "nowrap", sm: "wrap"},
      overflowX: {xs: "auto", sm: "visible"},
      gap: 1,
      py: 1,
      mb: 1,
      minHeight: 40,
    }}
  >
    {allergens.map((allergen) => (
      <Tooltip key={allergen.id} title={allergen.description || allergen.name}>
        <Box
          component="img"
          src={allergen.iconUrl}
          alt={allergen.name}
          sx={{
            width: 40,
            height: 40,
            objectFit: "contain",
          }}
        />
      </Tooltip>
    ))}
  </Box>
);

export default AllergenIcons;
