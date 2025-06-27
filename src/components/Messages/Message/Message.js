import React, {useContext} from 'react'
import styles from './Message.module.css';
import Cookies from 'js-cookie';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { IconButton } from '@mui/material';
import { ParentMessageContext } from "../../../context/context";

export default function Message({message, isThread=false}) {
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
          <div className={styles.messageContainer} style={{backgroundColor : myMessage ? '#044743' : '#042747'}}>
              <div className={styles.message}>{message['content']}</div>
              <div className={styles.time}>{message['created_on']}</div>
          </div>
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
