import React, { useEffect, useState, useContext } from "react";
import styles from "./Messages.module.css";
import Navbar from "../Navbar/Navbar";
import { openChat } from "../../actions/openChat";
import { MessagesContext, CurrentChatContext, WebSocketContext } from "../../context/context.js";
import Typography from "@mui/material/Typography";
import EditName from "./EditName.js";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";

import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { call_api } from "../../callwebservice.js";
import { CREATE_MESSAGE } from '../../constants.js';
import MessageList from "./MessageList/MessageList.js";
import InputMessage from "./InputMessage.js";

export default function Messages() {
  const openChatData = useSelector((state) => state.openChat);
  const dispatch = useDispatch();
  const { messages, setMessages } = useContext(MessagesContext);
  const { currentChat, setCurrentChat  } = useContext(CurrentChatContext);
  const socketRef = useContext(WebSocketContext);
  
  var currentDate = "";
  // const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const handleSendMessage = async () => {
    try {

      let payload = {
        "chat_id": currentChat['id'],
        "content": message,
        "document_id": null,
        "parent_message_id": null,
        "reference_message_id":null
      };
      let url = `${CREATE_MESSAGE}/${currentChat['id']}`;
      let response = await call_api.post(url, payload);
      
      let currentUser = Cookies.get("User");
      currentUser = JSON.parse(currentUser);
      
      if(response.status === 200 && response.data['status'] === 'success'){
        let currentMessageObj = {
          "chat_id": currentChat['id'],
          "content": message,
          "created_on": response.data['result']['created_on'],
          "parent_message_id": null,
          "sender_id": currentUser['id']
        };
        setMessages((prev) => [...prev, currentMessageObj]);
      }

      setMessage("");
      setTimeout(() => {
        // scroll to the bottom
        let element = document.getElementById("messages");
        element.scrollTop = element.scrollHeight ;
      }, 500);
      
    } catch (error) {
      // console.log(error);
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
      if (element.name === openChatData.name) {
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
    // setOpenChat((prev) => ({ ...prev, name: newName }));.
    dispatch(openChat({ ...openChatData, name: newName }));

    handleClose();
  };

  useEffect(() => {
    // listen the changes made at current user's document in Chat collection
    
  }, []);

  return (
    <div className={styles.container}>
      {(currentChat == null) ? (
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
          {/* Modal to edit the open chat user's name */}
          <EditName
            open={open}
            handleClose={handleClose}
            handleNameChange={handleNameChange}
          />

          <div className={styles.mainContainer}>
            <Navbar name={currentChat['chat_name']}
              number={currentChat['phone_number']}
              setOpen={setOpen} 
            />

            <MessageList messages={messages} handleSendMessage={handleSendMessage}/>

            <InputMessage className={styles.messageInput} handleSendMessage={handleSendMessage} setMessage={setMessage} message={message}/>
          </div>
        </>
      )}
    </div>
  );
}
