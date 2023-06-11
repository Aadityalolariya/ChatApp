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
  open,
  handleClose,
  addNumber,
  addName,
  setAddName,
  setAddNumber,
  handleAddChat,
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle variant="h5" sx={style}>Add chat</DialogTitle>
      <DialogContent sx={style}>
        <DialogContentText sx={{ color: "#c7c7c7" }}>
          Enter the phone number and name of new chat user.
        </DialogContentText>
        <TextField
          inputProps={{ style: { color: "#c7c7c7" } }}
          InputLabelProps={{ style: { color: "#c7c7c7" } }}
          value={addNumber}
          onChange={(e) => setAddNumber(e.target.value)}
          autoFocus
          margin="dense"
          id="number"
          label="Phone number"
          type="tel"
          fullWidth
          variant="outlined"
          sx={{ marginTop: "1rem" }}
        />
        <TextField
          inputProps={{ style: { color: "#c7c7c7" } }}
          InputLabelProps={{ style: { color: "#c7c7c7" } }}
          value={addName}
          onChange={(e) => setAddName(e.target.value)}
          autoFocus
          margin="dense"
          id="name"
          label="User name"
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
