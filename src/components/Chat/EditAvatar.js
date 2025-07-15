import React, { useEffect, useRef, useState, useContext } from "react";
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
import { UPLOAD_DOCUMENT, SET_PROFILE_PICTURE } from '../../constants';
import { call_api } from '../../callwebservice.js'
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

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null); // currently attached file
  const fileRef = useRef(null); // currently attached file ref

  function handleCloseEditAvatar() {
    setOpenEditAvatar(false);
  }

  function base64ToBlob(base64Data, contentType = '') {
    const parts = base64Data.split(',');
    const byteCharacters = atob(parts[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType || parts[0].split(':')[1].split(';')[0] });
  }
  
  
  const handleAttachDoc = () => {
    fileRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAttachedFile(file);
      const url = URL.createObjectURL(file);

      setImageUrl(url);
      setSelectedAvatar(null);

      return () => URL.revokeObjectURL(url); // cleanup
    }
  };

  const handleAvatarClick = (src) => {
    console.log("src: ", src)
    setSelectedAvatar(src);
    setImageUrl(null);
    setAttachedFile(null);
  }

  const handleSelectAvatar = async() => {
    let blob_obj = null;
    if(selectedAvatar){
      blob_obj = base64ToBlob(selectedAvatar);
    }
    else if(imageUrl){
      blob_obj = attachedFile;
    }
    if (blob_obj){
      let url = `${UPLOAD_DOCUMENT}`;
      const formData = new FormData();
      formData.append("file", blob_obj);
      let response = await call_api.postForm(url, formData);
      if (response.status === 200 && response.data["status"] === "success") {
        let documentId = response.data['result']['document_id'];
        
        console.log("dp file upload succeed: ", documentId);

        url = `${SET_PROFILE_PICTURE}?document_id=${documentId}`;
        response = await call_api.get(url);
        if (response.status === 200 && response.data["status"] === "success") {
          console.log("dp set successfully");
        }
        else{
          console.log("dp setting failed");
        }
      }
      else{
        console.log("dp file upload failed")
      }
    }
    setSelectedAvatar(null);
    setImageUrl(null);
    setAttachedFile(null);
    setOpenEditAvatar(false);
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
              <Avatar src={imageUrl ? imageUrl : selectedAvatar} sx={{ width: "9rem", height: "9rem" }} />
              <Typography variant="h6" sx = {{marginTop : '1rem'}} >Selected Avatar</Typography>
              <Button variant="contained" color = 'primary' onClick={handleAttachDoc}>Browse</Button>
              <input
                type="file"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
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
              <Button variant="contained" color = 'success' onClick={() => {handleSelectAvatar()}}>Ok</Button>
              <Button variant="contained" color = 'error' onClick={() => setOpenEditAvatar(false)}>Cancle</Button>

            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
