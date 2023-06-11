import React from 'react'
import styles from './Message.module.css';

const details = {title : 'name', message : 'this is the message', time : '10:00AM'}
export default function Message({title, message, timeStamp, sender}) {
  let myMessage = false;
  if(sender === localStorage.getItem('user').split(' ')[0]){
    myMessage = true;
  }
  return (
    <>
    <div className={styles.parentContainer} style={{justifyContent : myMessage ? 'flex-end' : 'flex-start'}}>

        <div className={styles.container} style={{backgroundColor : myMessage ? '#044743' : '#373737'}}>
            {/* <div className={styles.title}>{myMessage ? 'You:' : `${title}:`}</div> */}
            <div className={styles.message}>{message}</div>
            <div className={styles.time}>{timeStamp.split('|')[1]}</div>
        </div>
    </div>
    </>
  )
}
