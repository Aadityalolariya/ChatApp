import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, Button } from "@mui/material";
const style = {
  backgroundColor: "#171717",
  color: "#c7c7c7",
};
export default function AddChatDialog({
  addChatDialogBoxOpen,
  handleClose,
  addNumber,
  addName,
  setAddName,
  setAddNumber,
  handleAddChat,
}) {
  return (
    <Dialog open={addChatDialogBoxOpen} onClose={handleClose}>
      <DialogTitle variant="h5" sx={style}>Add chat</DialogTitle>
      <DialogContent sx={style}>
        <DialogContentText sx={{ color: "#c7c7c7" }}>
          Enter the phone number or email of the user.
        </DialogContentText>
        <TextField
          inputProps={{ style: { color: "#c7c7c7" } }}
          InputLabelProps={{ style: { color: "#c7c7c7" } }}
          value={addNumber}
          onChange={(e) => setAddNumber(e.target.value)}
          autoFocus
          margin="dense"
          id="name"
          label="Phone number / Email"
          type="text"
          fullWidth
          variant="outlined"
          sx={{ marginTop: "1rem" }}
        />
      </DialogContent>
      <DialogActions sx={style}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddChat}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
