import React, { useEffect, useState } from "react";
import styles from "./Chat.module.css";
import { Avatar } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const details = {
  name: "User",
  lastMsgTime: new Date().toISOString().split("T")[0],
  lastMsg: "okay",
};
export default function User({ name, lastMsgTime, lastMsg, number }) {
  const [avatarImg, setAvatarImg] = useState('');
  useEffect(() => {
    const getAvatarImage = async () => {
      const fetchedData = (await getDoc(doc(db, 'Avatar', number))).data();
      setAvatarImg(fetchedData.avatar);
    }
    getAvatarImage();
  }, [])
  
  return (
    <>
      <div className={styles.user}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Avatar sx = {{backgroundColor : '#373737'}} src={avatarImg}></Avatar>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>{name}</div>
            <div style={{ fontSize: "small", color: "#aaaaaa" }}>
              {details.lastMsg}
            </div>
          </div>
        </div>
        <div className={styles.lastMsgTime}> {details.lastMsgTime}</div>
      </div>
    </>
  );
}
