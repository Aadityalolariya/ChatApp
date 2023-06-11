import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import avt1 from "../assets/avt1.jpeg";
import avt2 from "../assets/avt2.jpeg";
import avt3 from "../assets/avt3.png";
import avt4 from "../assets/avt4.png";
import avt5 from "../assets/avt5.png";
import avt6 from "../assets/avt6.jpeg";
import avt7 from "../assets/avt7.jpeg";
import avt8 from "../assets/avt8.jpeg";
import avt9 from "../assets/avt9.jpeg";
import styles from "./EditAvatar.module.css";
import Grid from "@mui/material/Grid";
import { Avatar } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "max-content",
  color: "#c7c7c7",
  bgcolor: "#272727",
  border: "2px solid #000",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
};

export default function EditAvatar({ openEditAvatar, setOpenEditAvatar, setAvatarImg }) {

  const [selectedImg, setSelectedImg] = React.useState('');
  function handleCloseEditAvatar() {
    setOpenEditAvatar(false);
  }
  // console.log(new Blob([avt1]).size/1024);
  const handleAvatarClick = (src) => {
    setSelectedImg(src)
  }

  const handleSelectAvatar = async() => {
    setAvatarImg(selectedImg);
    setOpenEditAvatar(false);
    await updateDoc(doc(db, 'Avatar', localStorage.getItem('user').split(' ')[0]), {
      avatar : selectedImg
    })
  }

  return (
    <div>
      {/* <Button onClick={handleOpenEditAvatar}>Open modal</Button> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openEditAvatar}
        onClose={handleCloseEditAvatar}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openEditAvatar}>
          <Box sx={style} className={styles.container}>
            <div className={styles.preview}>
              <Avatar src={selectedImg} sx={{ width: "9rem", height: "9rem" }} />
              <Typography variant="h6" sx = {{marginTop : '1rem'}} >Selected Avatar</Typography>
            </div>
            <div className={styles.options}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Avatar className={styles.avatar} src = {avt1} id = 'avt1' onClick = {(e) => handleAvatarClick(avt1)}/>
                  <Avatar className={styles.avatar} src = {avt2} id = 'avt2' onClick = {(e) => handleAvatarClick(avt2)}/>
                  <Avatar className={styles.avatar} src = {avt3} id = 'avt3' onClick = {(e) => handleAvatarClick(avt3)}/>
                </Grid>
                <Grid item xs={4}>
                  <Avatar className={styles.avatar} src = {avt4} id = 'avt4' onClick = {(e) => handleAvatarClick(avt4)}/>
                  <Avatar className={styles.avatar} src = {avt5} id = 'avt5' onClick = {(e) => handleAvatarClick(avt5)}/>
                  <Avatar className={styles.avatar} src = {avt6} id = 'avt6' onClick = {(e) => handleAvatarClick(avt6)}/>
                </Grid>
                <Grid item xs={4}>
                  <Avatar className={styles.avatar} src = {avt7}id = 'avt7' onClick = {(e) => handleAvatarClick(avt7)}/>
                  <Avatar className={styles.avatar} src = {avt8}id = 'avt8' onClick = {(e) => handleAvatarClick(avt8)}/>
                  <Avatar className={styles.avatar} src = {avt9}id = 'avt9' onClick = {(e) => handleAvatarClick(avt9)}/>
                </Grid>
              </Grid>
            </div>
            <div className={styles.buttons}>
              <Button variant="outlined" color = 'success' onClick={handleSelectAvatar}>Ok</Button>
              <Button variant="outlined" color = 'error' onClick={() => setOpenEditAvatar(false)}>Cancle</Button>

            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
