import React, { createContext, useEffect, useState, useRef } from "react";
import Cookies from 'js-cookie';
import { GET_USER_INFO_BY_TOKEN_API } from '../constants.js'
import { call_api } from '../callwebservice.js';
export const WebSocketContext = createContext(null);
export const CurrentUserContext = createContext(null);
export const ChatsContext = createContext();
export const MessagesContext = createContext();
export const CurrentChatContext = createContext();
export const ParentMessageContext = createContext();

export const GlobalProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [currentUser, setCurrentUser] = useState({});
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const currentChatRef = useRef(currentChat);

  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  useEffect(() => {

    async function fetch_and_set_token() {
      // check for access token
      let available_token = Cookies.get("token")
      if (available_token && !socketRef.current)
      {
        // validate token
        let user_url = GET_USER_INFO_BY_TOKEN_API;
        let params = {"token": available_token};
        let response = await call_api.post(user_url, params);
        
        console.log("resp from get user by token: ", response);
        
        if(response.status == 200){
          let User = {
            "id": response.data['user_id'],
            "first_name": response.data['first_name'],
            "last_name": response.data['last_name'],
            "phone_number": response.data['phone_number'],
            "profile_picture": response.data['profile_picture']
          }
          Cookies.set("User", JSON.stringify(User));
          setCurrentUser(User);
          let user_id = response.data['user_id']
          socketRef.current = new WebSocket("ws://localhost:8000/ws?user_id=" + user_id);
          socketRef.current.onopen = () => {
          console.log("✅ WebSocket connected");
          };

          socketRef.current.onerror = (err) => {
          console.error("❌ WebSocket error:", err);
          };

          socketRef.current.onclose = (e) => {
          console.log("🔌 WebSocket closed:", e.reason);
          };

          socketRef.current.onmessage = (e) => {
              let message = e.data;
              try{
                let decoded_message = JSON.parse(e.data);
                console.log("decoded_message: ", decoded_message);
                console.log(" currentChat: ", currentChatRef.current);
                let topic = decoded_message['topic'];
                let data = decoded_message['data'];
                if(topic == 'message_sent'){
                  if(Number(currentChatRef.current['id']) == Number(data['chat_id'])){
                    setMessages((prev) => [...prev, data]);
                  }
                }
              }
              catch(err) {
                console.log("error while decoding received message: ", err)
              }
          }
        }
        
      }
    };

    fetch_and_set_token();
    
    
    return () => {
    socketRef.current?.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={ socketRef }>
      <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
        <ChatsContext.Provider value={{ chats, setChats }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <CurrentChatContext.Provider value={{ currentChat, setCurrentChat }}>
              {children}
            </CurrentChatContext.Provider>
          </MessagesContext.Provider>
        </ChatsContext.Provider>
      </CurrentUserContext.Provider>
    </WebSocketContext.Provider>
  );
};

export const MainProvider = ({children}) => {
  const [threadOpen, setThreadOpen] = useState(false);
  const [parentMessage, setParentMessage] = useState(null);

  return (
    <ParentMessageContext.Provider value={{parentMessage, setParentMessage}}>
      {children}
    </ParentMessageContext.Provider>
  )
}