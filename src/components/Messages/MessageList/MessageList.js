import React, { useContext, useState } from 'react'
import styles from './MessageList.module.css';
import { ThreadMessagesContext, ParentMessageContext } from "../../../context/context";
import Message from '../Message/Message';
import { Typography } from '@mui/material';
import InputMessage from '../InputMessage';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { CREATE_MESSAGE } from '../../../constants'
import { call_api } from '../../../callwebservice';
import Cookies from 'js-cookie';

export default function MessageList({messages, handleDownloadFile, handleSendMessage}) {
  const { parentMessage, setParentMessage } = useContext(ParentMessageContext);
  
  const [threadMessage, setThreadMessage] = useState("");
  
  const handleThreadClose = () => {
    setParentMessage(null);
  }

  const handleSendThreadMessage = async () => {
    try {

      let payload = {
        "chat_id": parentMessage['chat_id'],
        "content": threadMessage,
        "document_id": null,
        "parent_message_id": parentMessage['id'],
        "reference_message_id":null
      };
      let url = `${CREATE_MESSAGE}/${parentMessage['chat_id']}`;
      let response = await call_api.post(url, payload);
      
      let currentUser = Cookies.get("User");
      currentUser = JSON.parse(currentUser);
      
      if(response.status === 200 && response.data['status'] === 'success'){
        let currentMessageObj = {
          "content": threadMessage,
          "chat_id": parentMessage['chat_id'],
          "parent_message_id": parentMessage['id'],
          "created_on": response.data['result']['created_on'],
          "sender_id": currentUser['id']
        };

        // update the parent message by adding the current message obj in chile_messages
        parentMessage['child_messages'] = [...parentMessage['child_messages'], currentMessageObj];
        setParentMessage(parentMessage);
      }

      setThreadMessage("");
      setTimeout(() => {
        // scroll to the bottom
        let element = document.getElementById("threadmessages");
        element.scrollTop = element.scrollHeight ;
      }, 500);
      
    } catch (error) {
      // console.log(error);
    }
  };

  
  return (
    <>
        <div className={styles.mainContainer }>

          <div className={parentMessage == null ? styles.messages : styles.messagesWithThread} id="messages">
              {messages?.map((element, index) => {
              return (
                  <Message
                    handleDownloadFile={handleDownloadFile}
                    message={element}
                    key={`message_chat_${index}`}
                  />
              );
              })}
              
          </div>

          {parentMessage != null ?
          <div className={`${styles.threads}`} id="threadmessages">
            <div className={styles.threadHeader}>
              <Typography variant='h5'>
                Threads
              </Typography>
              {/* <HighlightOffRoundedIcon/> */}
              <CloseRoundedIcon onClick = {() => {handleThreadClose()}}/>
            </div>
            <div className={styles.threadList}>
              {parentMessage['child_messages']?.map((element, index) => {
                return (
                    <Message
                      handleDownloadFile={handleDownloadFile}
                      isThread = {true}
                      message={element}
                      key={`message_chat_${index}`}
                    />
                );
              })}
            </div>
            <div className={styles.messageInput}>
              <InputMessage  handleSendMessage={handleSendThreadMessage} setMessage={setThreadMessage} message={threadMessage}/>
            </div>
          </div> : <></>}
        </div>

    </>
  )
}
