import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditAvatar from "./EditAvatar";
const profileStyle = {
  position: "absolute",
  bottom: "0%",
  left: "0%",
  width: "max-content",
  borderRadius: "15px",
  border: "2px solid #000",
  boxShadow: 24,
  backgroundColor: "#272727",
  color: "#c7c7c7",
  p: 4,
};

const handleMouseEnter = () => {
  let avatar = document.getElementById("dp");
  avatar.style.opacity = 0.5;
};

export default function Profile({
  openProfile,
  handleCloseProfile,
  avatarImg,
  setAvatarImg,
}) {
  const [openEditAvatar, setOpenEditAvatar] = useState(false);

  const handleMouseLeave = () => {
    let avatar = document.getElementById("dp");
    avatar.style.opacity = 1;
  };

  const handleAvatarClick = () => {
    setOpenEditAvatar(true);
  };

  return (
    <>
      <EditAvatar
        setOpenEditAvatar={setOpenEditAvatar}
        openEditAvatar={openEditAvatar}
        setAvatarImg={setAvatarImg}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openProfile}
        onClose={handleCloseProfile}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openProfile}>
          <Box sx={profileStyle}>
            <Tooltip title="Edit" placement="right">
              <Avatar
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleAvatarClick}
                id="dp"
                sx={{
                  width: "6rem",
                  height: "6rem",
                  backgroundColor: "#171717",
                  fontSize: "3rem",
                }}
                src={avatarImg}
              />
            </Tooltip>

            <Typography
              id="transition-modal-description"
              sx={{ mt: 2 }}
              variant="h6"
            >
              {`Name : ${localStorage.getItem("user").split(" ")[1]} ${
                localStorage.getItem("user").split(" ")[2]
              }`}
              <Tooltip title = 'Edit name' placement="right" arrow>
                <IconButton sx={{ marginLeft: "1rem" }}>
                  <EditIcon color="warning" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Typography sx={{ mt: 2 }} variant="h6">
              {`Number : ${localStorage.getItem("user").split(" ")[0]}`}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
