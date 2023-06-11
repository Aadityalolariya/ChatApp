import React, { useState } from "react";
import styles from "./Main.module.css";
import Chat from "../Chat/Chat";
import Messages from "../Messages/Messages";

export default function Main() {
  const [openChat, setOpenChat] = useState({name : '', number : ''});
  return (
    <>
      <div className={styles.container} style={{ overflowX: "hidden" }}>
        <Chat setOpenChat={setOpenChat} />
        <Messages openChat={openChat} setOpenChat = {setOpenChat} />
      </div>
    </>
  );
}
