import React, { useEffect, useState, useContext } from "react";
import styles from "./Chat.module.css";
import { FETCH_CHATS, SEARCH_USER } from "../../constants.js";
import { call_api } from "../../callwebservice.js";
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
import GroupsIcon from "@mui/icons-material/Groups";
import AddChatDialog from "./AddChatDialog.js";
import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";
import User from "./User";
import { db } from "../firebaseConfig";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openChat } from "../../actions/openChat";
import {
  OPEN_CHAT,
  CREATE_CHAT,
  LOGOUT_USER,
  GET_DOCUMENT,
} from "../../constants.js";
import {
  MessagesContext,
  ChatsContext,
  CurrentChatContext,
  CurrentUserContext,
  ParentMessageContext,
} from "../../context/context.js";
import AddGroupDialog from "./AddGroupDialog.js";

export default function Chat() {
  const [addChatDialogBoxOpen, setAddChatDialogBoxOpen] = useState(false);
  const [addGroupDialogBoxOpen, setAddGroupDialogBoxOpen] = useState(false);
  const [addNumber, setAddNumber] = useState("");
  const [addName, setAddName] = useState("");
  const [chatsToDisplay, setChatsToDisplay] = useState([]);
  const [profilePictures, setProfilePictures] = useState({});
  const [searchText, setSearchText] = useState("");
  const { chats, setChats } = useContext(ChatsContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const { currentChat, setCurrentChat } = useContext(CurrentChatContext);
  const { parentMessage, setParentMessage } = useContext(ParentMessageContext);

  const navigate = useNavigate();

  const fetch_profile_pictures = async (chats) => {
    console.log("fetching profile pictures : ", chats);

    const promises = chats.map(async (chat) => {
      if (chat["profile_picture"]) {
        let url = `${GET_DOCUMENT}/${chat["profile_picture"]}`;
        let response = await call_api.get(url, {
          responseType: "blob",
        });
        console.log(
          `get profile picture for user: ${chat["id"]}`,
          response.data
        );

        return { id: chat["id"], blob: response.data };
      }
      return null;
    });

    const results = await Promise.all(promises);

    // Filter out null results (users without profile pictures)
    const validResults = results.filter(Boolean);

    // Construct a new object from all fetched profile pictures
    const newPictures = validResults.reduce((acc, { id, blob }) => {
      acc[id] = blob;
      return acc;
    }, {});

    console.log("newPictures: ", newPictures)

    // Update state immutably once
    setProfilePictures((prev) => {
      const updated = { ...prev, ...newPictures };
      console.log("Updated profilePictures: ", updated);
      return updated;
    });
  };

  useEffect(() => {
    (async () => {
      let response = await call_api.get(FETCH_CHATS);
      console.log("fetch chats response: ", response);
      if (response.status == 200 && response.data["status"] == "success") {
        let fetched_chats = response.data["result"]["chats"];
        setChats(fetched_chats);

        let users = response.data["result"]["users"];
        if (users.length > 0) {
          await fetch_profile_pictures(fetched_chats);
        }
        console.log("profile_picture: ", profilePictures);
      } else {
        setChats([]);
      }
    })();
  }, []);

  // open add chat
  const handleAddChatDialogOpen = () => {
    setAddChatDialogBoxOpen(true);
  };

  // close add chat
  const handleAddChatDialogClose = () => {
    setAddChatDialogBoxOpen(false);
  };

  // open group chat
  const handleAddGroupDialogOpen = () => {
    setAddGroupDialogBoxOpen(true);
  };

  // close group chat
  const handleAddGroupDialogClose = () => {
    setAddGroupDialogBoxOpen(false);
  };

  const handleSearch = () => {
    if (searchText === "") {
      setChatsToDisplay(chats);
      return;
    }
    setChatsToDisplay((prev) => {
      return chats.filter((chat) =>
        chat.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
      );
    });
  };

  // handle adding the chat
  const handleAddChat = async () => {
    handleAddChatDialogClose();
    if (addNumber.length !== 10) {
      alert("Please enter valid details!");
      return;
    }
    try {
      // Get the current user and user to be added details
      let payload = {
        search: addNumber,
      };
      let response = await call_api.post(SEARCH_USER, payload);

      setAddNumber("");
      setAddName("");

      if (response.status == 400 || response.data["status"] != "success") {
        // If the user to be added doesn't exist then display error
        alert("User not found...");
        return;
      } else {
        setAddChatDialogBoxOpen(false);

        // create chat
        let currentUser = Cookies.get("User");
        currentUser = JSON.parse(currentUser);
        let addedUserId = Number(response.data["result"]["id"]);
        payload = {
          user_ids: [addedUserId, Number(currentUser["id"])],
          is_group_chat: false,
        };
        response = await call_api.post(CREATE_CHAT, payload);
        if (response.status == 200 && response.data["status"] == "success") {
          let chatObj = {
            id: response.data["result"]["id"],
            is_group_chat: false,
            chat_name: response.data["result"]["chat_name"],
            created_on: response.data["result"]["created_on"],
            admin_user_id: null,
          };
          setChats((prev) => [chatObj, ...prev]);
        } else {
          console.log("error in creating chat");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChatClick = async (chat_id) => {
    // set current chat
    for (let i = 0; i < chats.length; i++) {
      if (chats[i]["id"] == chat_id) {
        setCurrentChat(chats[i]);
        setParentMessage(null);

        console.log("current chat: ", chats[i]);
        break;
      }
    }

    // fetch messages
    let url = `${OPEN_CHAT}/${chat_id}`;
    let response = await call_api.get(url);
    if (response.status == 200 && response.data["status"] == "success") {
      let result = response.data["result"]["messages"];
      setMessages(result);
    } else {
      console.log("error in fetching messages");
      setMessages([]);
    }
  };


  return (
    <>
      <div className={styles.mainContainer}>
        {/* Dialog box displayed when new user is to be added  */}
        <AddChatDialog
          addChatDialogBoxOpen={addChatDialogBoxOpen}
          handleClose={handleAddChatDialogClose}
          addNumber={addNumber}
          addName={addName}
          setAddName={setAddName}
          setAddNumber={setAddNumber}
          handleAddChat={handleAddChat}
        />

        <AddGroupDialog
          addChatDialogBoxOpen={addGroupDialogBoxOpen}
          setAddChatDialogBoxOpen={setAddChatDialogBoxOpen}
          handleAddGroupDialogClose={handleAddGroupDialogClose}
        />

        {/* Components having all the chat list */}
        <div className={styles.header}>
          <div>Chats</div>
          <Chip
            avatar={<GroupsIcon style={{ color: "white" }} />}
            label="Add Group"
            color="success"
            onClick={handleAddGroupDialogOpen}
            sx={{ fontWeight: "300" }}
          />
          <Chip
            avatar={<AddIcon style={{ color: "white" }} />}
            label="Add Chat"
            color="info"
            onClick={handleAddChatDialogOpen}
            sx={{ fontWeight: "300" }}
          />
        </div>

        {/* Search input field */}
        <FormControl color="success" sx={{ marginTop: "1rem" }}>
          <InputLabel htmlFor="searchInput" sx={{ color: "white" }}>
            Search
          </InputLabel>
          <Input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            id="searchInput"
            inputProps={{ style: { color: "white" } }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon sx={{ color: "white" }} />
                </IconButton>
              </InputAdornment>
            }
          ></Input>
        </FormControl>

        <div className={styles.chatlist}>
          {chats &&
            chats.map((element, index) => {
              return (
                <div
                  onClick={() => handleChatClick(element["id"])}
                  key={`user${index}`}
                >
                  <User
                    user={element}
                    key={index}
                    profile_picture={profilePictures} // ✔️ this is correct
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
