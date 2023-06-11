import React, { useEffect, useState } from "react";
import styles from "./Messages.module.css";
import Navbar from "../Navbar/Navbar";
import Message from "./Message/Message";
import SendIcon from "@mui/icons-material/Send";

import Typography from "@mui/material/Typography";
import EditName from "./EditName.js";

import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Messages({ openChat, setOpenChat }) {
  var currentDate = "";
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const handleSendMessage = async () => {
    try {
      const userNumber = localStorage.getItem("user").split(" ")[0];
      setMessage("");
      let currTime = new Date();

      // create timestamp string
      const timeStamp = `${currTime.getDate()}-${
        currTime.getMonth() + 1
      }-${currTime.getFullYear()}|${currTime.getHours()}:${currTime.getMinutes()}`;
      // console.log(chat);

      // create the object for storing the message with timestamp and sender number
      const newChat = [
        ...chat,
        { number: userNumber, message: message, timeStamp },
      ];
      setChat(newChat);

      // update the chat array of current user
      await updateDoc(doc(db, "Chats", userNumber), {
        [openChat.number]: newChat,
      });

      // update the chat array of user at the other end
      await updateDoc(doc(db, "Chats", openChat.number), {
        [userNumber]: newChat,
      });

      // scroll to the bottom
      let element = document.getElementById("messages");
      element.scrollTop = element.scrollHeight;
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameChange = async () => {
    let newName = document.getElementById("newName").value;

    // Check whether it is valid name
    if (newName.length === 0) {
      alert("Please enter valid name...");
      return;
    }
    const userNumber = localStorage.getItem("user").split(" ")[0];

    // get the current user chat list
    const chatsOfCurrentUser = (
      await getDoc(doc(db, "Users", userNumber))
    ).data().chats;
    document.getElementById("newName").value = "";

    // create array with updated name
    const newChatsOfCurrentUser = chatsOfCurrentUser.map((element) => {
      if (element.name === openChat.name) {
        return { name: newName, number: element.number };
      } else {
        return element;
      }
    });

    // change the name of the selected user to new name in current user's chat list
    await updateDoc(doc(db, "Users", userNumber), {
      chats: newChatsOfCurrentUser,
    });

    // update the openChat state to update the name displayed in navbar
    setOpenChat((prev) => ({ ...prev, name: newName }));
    handleClose();
  };

  useEffect(() => {
    // listen the changes made at current user's document in Chat collection
    onSnapshot(
      doc(db, "Chats", localStorage.getItem("user").split(" ")[0]),
      (doc) => {
        // console.log("Current data: ", doc.data());
        setChat(doc.data()[openChat.number]);
      }
    );
    const userNumber = localStorage.getItem("user").split(" ")[0];

    // get the chats of the selected user
    (async () => {
      const allMessages = (await getDoc(doc(db, "Chats", userNumber))).data();
      const requiredChats = allMessages[openChat.number];
      console.log(allMessages);
      setChat(requiredChats);
    })();
  }, [openChat]);

  return (
    <div className={styles.container} id="messages">
      {openChat.number === "" ? (
        // rendered when no chat is selected (initially)
        <div className={styles.noChat}>
          <Typography
            variant="h2"
            sx={{ fontWeight: "600", textAlign: "center" }}
          >
            Welcome to Chat Now!
          </Typography>
          <Typography variant="body1">
            {" "}
            This web app is developed only for learning and practice purpose.{" "}
          </Typography>
          <Typography variant="body1">
            {" "}
            The developer doesn't claim any kind of ownership over the design,
            name or logo.{" "}
          </Typography>
          <Typography variant="h6">Developer : Aaditya Lolariya</Typography>
        </div>
      ) : (
        // When chat is selcted
        <>
          {/* Navbar of the chat */}
          <Navbar
            name={openChat.name}
            number={openChat.number}
            setOpen={setOpen}
          />

          {/* Modal to edit the open chat user's name */}
          <EditName
            open={open}
            handleClose={handleClose}
            handleNameChange={handleNameChange}
          />

          {/* All the chats with selected user */}
          <div className={styles.messages}>
            {chat?.map((element, index) => {
              const date = element.timeStamp.split("|")[0];
              if (date !== currentDate) {
                currentDate = date;
                return (
                  <div key={`message_chat_${index}`}>
                    <div className={styles.appMessage}>
                      <span
                        style={{
                          backgroundColor: "rgba(0, 162, 255, 0.122)",
                          border: "1px solid rgba(0, 162, 255)",
                          padding: "0.5rem",
                          borderRadius: "7px",
                        }}
                      >
                        {date}{" "}
                      </span>
                    </div>
                    <Message
                      title={openChat.name}
                      message={element.message}
                      sender={element.number}
                      timeStamp={element.timeStamp}
                    />
                  </div>
                );
              }
              return (
                <Message
                  title={openChat.name}
                  message={element.message}
                  sender={element.number}
                  timeStamp={element.timeStamp}
                  key={`message_chat_${index}`}
                />
              );
            })}
          </div>

          {/* Message input field */}
          <div className={styles.msgInput}>
            <FormControl fullWidth>
              <OutlinedInput
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                sx={{ backgroundColor: "#272727" }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleSendMessage}>
                      <SendIcon sx={{ color: "white" }} />
                    </IconButton>
                  </InputAdornment>
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                inputProps={{ style: { color: "white" } }}
              />
            </FormControl>
          </div>
        </>
      )}
    </div>
  );
}
