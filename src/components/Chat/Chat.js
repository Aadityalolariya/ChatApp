import React, { useEffect, useState } from "react";
import styles from "./Chat.module.css";
import {
  Avatar,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import AddChatDialog from "./AddChatDialog.js";
import SearchIcon from "@mui/icons-material/Search";
import Profile from "./Profile.js";

import User from "./User";
import { db } from "../firebaseConfig";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Chat({ setOpenChat }) {
  const [open, setOpen] = useState(false);
  const [addNumber, setAddNumber] = useState("");
  const [addName, setAddName] = useState("");
  const [chats, setChats] = useState([]);
  const [chatsToDisplay, setChatsToDisplay] = useState([]);
  const [openProfile, setOpenProfile] = useState(false);
  const [avatarImg, setAvatarImg] = useState("");
  const [searchText, setSearchText] = useState("");
  // const [chatAvatars, setChatAvatars] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userNumber = localStorage.getItem("user").split(" ")[0];

    // Getting profile picture of the user
    const getProfilePicture = async () => {
      const fetchedData = await getDoc(doc(db, "Avatar", userNumber));
      const profilePic = fetchedData.data().avatar;
      setAvatarImg(profilePic);
    };

    // Getting the chats when component is rendered
    const getChatData = async () => {
      const fetchedData = await getDoc(doc(db, "Users", userNumber));
      const chatData = fetchedData.data().chats;

      // set the chats state to the fetched chats
      setChats(chatData);
      setChatsToDisplay(chatData);
    };

    getProfilePicture();
    getChatData();

    onSnapshot(
      doc(db, "Users", localStorage.getItem("user").split(" ")[0]),
      (doc) => {
        // console.log("Current data: ", doc.data());
        getChatData();
      }
    );
  }, []);

  // open add chat
  const handleClickOpen = () => {
    setOpen(true);
  };

  // close add chat
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenProfile = () => setOpenProfile(true);
  const handleCloseProfile = () => setOpenProfile(false);

  const handleSearch = () => {
    if(searchText === ''){
      setChatsToDisplay(chats);
      return;
    }
    setChatsToDisplay((prev) => {
      return chats.filter((chat) => chat.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
    })
  };

  // handle adding the chat
  const handleAddChat = async () => {
    handleClose();
    if (addNumber.length !== 10 || addName.length === 0) {
      alert("Please enter valid details!");
      return;
    }
    try {
      const userNumber = window.localStorage.getItem("user").split(" ")[0];

      // Get the current user and user to be added details
      const result = await getDoc(doc(db, `Users`, userNumber));
      const userToBeAdded = await getDoc(doc(db, "Users", addNumber));

      // If the user to be added doesn't exist then display error
      if (!userToBeAdded.exists()) {
        alert("User not found...");
        setAddNumber("");
        setAddName("");
        return;
      }

      let resultData = result.data();
      let userToBeAddedData = userToBeAdded.data();

      // push the name and number of the user to be added in current user
      resultData.chats.push({ number: addNumber, name: addName });

      // push the name and number of the current user in user to be added
      userToBeAddedData.chats.push({ number: userNumber, name: userNumber });

      setAddNumber("");
      setAddName("");

      // set both the documents to the updated chats array and add empty array in Chats collection
      await setDoc(doc(db, "Users", userNumber), {
        ...resultData,
      });
      await updateDoc(doc(db, "Chats", userNumber), {
        [addNumber]: [],
      });

      await setDoc(doc(db, "Users", addNumber), {
        ...userToBeAddedData,
      });
      await updateDoc(doc(db, "Chats", addNumber), {
        [userNumber]: [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.mainContainer}>
        {/* Dialog box displayed when new user is to be added  */}
        <AddChatDialog
          open={open}
          handleClose={handleClose}
          addNumber={addNumber}
          addName={addName}
          setAddName={setAddName}
          setAddNumber={setAddNumber}
          handleAddChat={handleAddChat}
        />

        {/* Profile modal */}
        <Profile
          openProfile={openProfile}
          handleCloseProfile={handleCloseProfile}
          avatarImg={avatarImg}
          setAvatarImg={setAvatarImg}
        />

        {/* Side bar component */}
        <div className={styles.sidebar}>
          <Tooltip title="Profile" placement="right" arrow>
            <IconButton onClick={handleOpenProfile}>
              <Avatar
                sx={{
                  width: "2rem",
                  height: "2rem",
                  backgroundColor: "#373737",
                }}
                src={avatarImg}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout" placement="right" arrow>
            <IconButton
              color="error"
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/signin");
              }}
            >
              <LogoutIcon color="error" />
            </IconButton>
          </Tooltip>
        </div>

        {/* Components having all the chat list */}
        <div className={styles.container}>
          <div className={styles.header}>
            <div>Chats</div>
            <Chip
              avatar={<AddIcon style={{ color: "white" }} />}
              label="Add Chat"
              color="info"
              onClick={handleClickOpen}
              sx={{ fontWeight: "300" }}
            />
          </div>

          {/* Search input field */}
          <FormControl color="success" sx = {{marginTop : '1rem'}}>
            <InputLabel htmlFor="searchInput" sx={{ color: "white" }}>
              Search
            </InputLabel>
            <Input
              onKeyDown={(e) => {
                if(e.key === 'Enter'){
                  handleSearch();
                }
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              id="searchInput"
              inputProps={{ style: { color: "white" } }}
              endAdornment={
                <InputAdornment>
                  <IconButton onClick={handleSearch}>
                    <SearchIcon sx={{ color: "white" }} />
                  </IconButton>
                </InputAdornment>
              }
            ></Input>
          </FormControl>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {chats &&
              chatsToDisplay.map((element, index) => {
                return (
                  <div
                    onClick={(e) => {
                      setOpenChat({
                        name: element.name,
                        number: element.number,
                      });
                      console.log("Changed");
                    }}
                    key={`user${index}`}
                  >
                    <User name={element.name} number={element.number} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
