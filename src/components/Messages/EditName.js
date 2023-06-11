import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Typography, TextField, Button } from "@mui/material";

const style = {
  position: "absolute",
  color: "#c7c7c7",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#272727",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

export default function EditName({ open, handleClose, handleNameChange }) {
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Edit user name
            </Typography>
            <TextField
              fullWidth
              id="newName"
              placeholder="Enter user name..."
              sx={{ marginTop: "1.5rem" }}
              variant="outlined"
              color="success"
              label="Name"
              InputLabelProps={{ style: { color: "#c7c7c7" } }}
              inputProps={{ style: { color: "#c7c7c7" } }}
            />

            <Button
              variant="outlined"
              color="success"
              sx={{ marginTop: "1rem" }}
              onClick={handleNameChange}
            >
              Ok
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
