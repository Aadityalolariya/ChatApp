import React from "react";
import styles from "./Main.module.css";
import Chat from "../Chat/Chat";
import Messages from "../Messages/Messages";

export default function Main() {
  return (
    <>
      <div className={styles.container} style={{ overflowX: "hidden" }}>
        <Chat />
        <Messages />
      </div>
    </>
  );
}
