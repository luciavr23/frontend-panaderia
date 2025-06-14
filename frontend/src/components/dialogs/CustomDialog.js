import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

const CustomDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "sm",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
          boxShadow: "0px 6px 18px rgba(0,0,0,0.12)",
        },
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            fontWeight: 600,
            color: "#8DBB01",
            borderBottom: "1px solid #e0e0e0",
            pb: 1,
          }}
        >
          {title}
        </DialogTitle>
      )}

      <DialogContent
        dividers
        sx={{
          maxHeight: 400,
          overflowY: "auto",
          px: 2,
          py: 1.5,
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{px: 2, pb: 2}}>
          {actions}
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderColor: "#8DBB01",
              color: "#8DBB01",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#5a774a",
                color: "#5a774a",
              },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CustomDialog;
