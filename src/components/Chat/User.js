import React, { useEffect, useState } from "react";
import styles from "./Chat.module.css";
import Avatar from '@mui/material/Avatar';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';

const details = {
  name: "User",
  lastMsgTime: new Date().toISOString().split("T")[0],
  lastMsg: "okay",
};
export default function User({ user, profile_picture }) {
  const [imageURL, setImageURL] = useState(null);

   useEffect(() => {
    console.log("User:", user, " ", profile_picture)
    if(profile_picture[user['id']]){
      console.log("profile_picture: ", profile_picture[user['id']])
      const url = URL.createObjectURL(profile_picture[user['id']]);
      setImageURL(url);
      return () => URL.revokeObjectURL(url); // cleanup
    }
    
  }, [profile_picture, user]);
  
  return (
    <>
      <div className={styles.user}>
        <div style={{ display: "flex", gap: "1rem" }}>
          {(imageURL) ? <Avatar sx = {{backgroundColor : '#373737'}} src={imageURL}> </Avatar>
           : <Avatar sx = {{backgroundColor : '#373737'}} src=''> {user['is_group_chat'] ? <GroupsIcon/> : <PersonIcon/>}</Avatar>}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>{user['chat_name']}</div>
            <div style={{ fontSize: "small", color: "#aaaaaa" }}>
              {details.lastMsg}
            </div>
          </div>
        </div>
        <div className={styles.lastMsgTime} style={{ fontSize: "small" }}> {details.lastMsgTime}</div>
      </div>
    </>
  );
}
