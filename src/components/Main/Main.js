import React, { useState, useEffect } from "react";
import styles from "./Main.module.css";
import Chat from "../Chat/Chat";
import Messages from "../Messages/Messages";
import { useNavigate } from "react-router-dom";
import { MainProvider } from "../../context/context";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { LOGOUT_USER, GET_DOCUMENT } from "../../constants";
import { call_api } from "../../callwebservice";
import Cookies from "js-cookie";
import Profile from "../Chat/Profile";

export default function Main() {
  const [openProfile, setOpenProfile] = useState(false);
  const [avatarImg, setAvatarImg] = useState("");
  const [profilePictures, setProfilePictures] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {

    (async () => {
      if (currentUser["profile_picture"]) {
        let url = `${GET_DOCUMENT}/${currentUser["profile_picture"]}`;
        let response = await call_api.get(url, {
          responseType: "blob",
        });
        console.log(
          `get profile picture for user: ${currentUser["id"]}`,
          response.data
        );
        console.log("settings profile picture: ", response.data)
        setProfilePictures(response.data);
      }
    })();

    
  }, []);

    
  useEffect(() => {
    if (profilePictures) {
      const objectURL = URL.createObjectURL(profilePictures);
      setImageURL(objectURL);
      console.log("Setting image URL:", objectURL);

      return () => {
        URL.revokeObjectURL(objectURL); // Cleanup
      };
    }
  }, [profilePictures]);


  let currentUser = Cookies.get("User");
  currentUser = JSON.parse(currentUser);
  // useEffect(() => {
  // }, []);

  const handleLogOutClick = async () => {
    let url = LOGOUT_USER + `/${currentUser.id}`;
    let response = await call_api.get(url);
    if (response.status == 200 && response.data["status"] == "success") {
      Cookies.remove("token");
      Cookies.remove("User");
      navigate("/signin");
    }
  };

  const handleOpenProfile = () => setOpenProfile(true);

  const handleCloseProfile = () => setOpenProfile(false);

  return (
    <>
      <MainProvider>
        <div className={styles.mainContainer}>
          {/* Profile modal */}
        
          <Profile
            openProfile={openProfile}
            handleCloseProfile={handleCloseProfile}
            avatarImg={avatarImg}
            setAvatarImg={setAvatarImg}
            imageURL={imageURL}
          />

          {/* Side bar component */}
          <div className={styles.sidebar}>
            <Tooltip title="Profile" placement="right" arrow>
              <IconButton onClick={() => {handleOpenProfile()}}>
                <Avatar
                  sx={{
                    width: "2rem",
                    height: "2rem",
                    backgroundColor: "#373737",
                  }}
                  src={imageURL}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout" placement="right" arrow>
              <IconButton
                color="error"
                onClick={() => {
                  handleLogOutClick();
                }}
              >
                <LogoutIcon color="error" />
              </IconButton>
            </Tooltip>
          </div>

          <Chat />
          <Messages />
        </div>
      </MainProvider>
    </>
  );
}
