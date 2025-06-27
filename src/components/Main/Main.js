import React from "react";
import styles from "./Main.module.css";
import Chat from "../Chat/Chat";
import Messages from "../Messages/Messages";
import { MainProvider } from '../../context/context';

export default function Main() {

  return (
    <>
      <MainProvider>
        <div className={styles.mainContainer}>
          <Chat/>
          <Messages/>
        </div>
      </MainProvider>
    </>
  );
}
