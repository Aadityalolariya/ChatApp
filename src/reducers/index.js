import { combineReducers } from "redux";
import { openChat } from "./openChat.js"; 
import { userChat } from "./userChat.js";
import { otherUserChat } from "./otherUserChat.js";
export default combineReducers({
    openChat,
    userChat,
    otherUserChat
});