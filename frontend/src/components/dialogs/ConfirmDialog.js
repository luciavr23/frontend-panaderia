import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "primary",
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
          boxShadow: "0px 6px 18px rgba(0,0,0,0.12)",
        },
      }}
    >
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

      <DialogContent dividers sx={{px: 2, py: 1.5}}>
        <Typography variant="body2">{message}</Typography>
      </DialogContent>

      <DialogActions sx={{px: 2, pb: 2}}>
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
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
