import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const DeleteDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Confirm Action",
  description = "Are you sure you want to perform this action?",
  onCancel,
  onConfirm,
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="error">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
