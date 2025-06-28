import React, {useContext} from 'react'
import styles from './Message.module.css';
import Cookies from 'js-cookie';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { IconButton, Typography } from '@mui/material';
import { ParentMessageContext } from "../../../context/context";
import FileDownloadIcon from '@mui/icons-material/FileDownload';


export default function Message({message, handleDownloadFile, isThread=false}) {
  let myMessage = false;
  let currentUser = Cookies.get("User");
  currentUser = JSON.parse(currentUser);
  const { parentMessage, setParentMessage } = useContext(ParentMessageContext);
    

  const handleThreadButton = () => {
    setParentMessage(message);
  }

  if(message['sender_id'] == currentUser['id']){
    myMessage = true;
  }
  return (
    <>
    <div className={styles.parentContainer} style={{justifyContent : myMessage ? 'flex-end' : 'flex-start'}}>
        <div className={styles.wrapper}>
          {message['document_id'] != null ? 
            <div className={styles.documentContainer} style={{backgroundColor : myMessage ? '#044743' : '#042747'}}>
              <div className={styles.documentMainBody}>
                <div className={styles.message}> 
                  <IconButton onClick={() => handleDownloadFile(message['document_id'], message['document_name'])}>
                    <FileDownloadIcon sx = {{color: 'white'}}/> 
                  </IconButton>
                </div>

                <div className={styles.documentDetails}>
                  <Typography variant='subtitle2'>{message['document_name']}</Typography>
                  <Typography variant='caption'>{(message['document_size']/1024).toFixed(1)} kB</Typography>
                </div>
              </div>
              
              {/* if the message is not available along with the document, show the timestamp of msg with document details itself */}
              {
                ((message['content'] == null || message['content'] == "") && (message['document_id'] != null)) ? 
                <div className={styles.time}>{message['created_on']}</div> : <></>
              }

            </div> : <></>}
          
          {((message['content'] != null && message['content'] != "") || (message['document_id'] == null)) ? <div className={styles.messageContainer} style={{backgroundColor : myMessage ? '#044743' : '#042747'}}>
              <div className={styles.message}>{message['content']}</div>
              <div className={styles.time}>{message['created_on']}</div>
          </div> : <></>}

          {!isThread ? <div className={styles.messageBase} style={{justifyContent : myMessage ? 'flex-start' : 'flex-end'}}>
            <IconButton sx={{zIndex: 0, color: 'white'}} onClick={() => handleThreadButton()}>
              <ForumOutlinedIcon className={styles.threadIcon} fontSize='small'/>
            </IconButton>
          </div> : <></>}
        </div>
    </div>
    
    </>
  )
}
