import React from 'react'
import styles from './Messages.module.css';
import SendIcon from "@mui/icons-material/Send";
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";

export default function InputMessage({ handleSendMessage, setMessage, message }) {
  return (
    <>
        <div className={styles.msgInput}>
            <FormControl fullWidth>
                <OutlinedInput
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    handleSendMessage();
                    }
                }}
                sx={{ backgroundColor: "#272727" }}
                endAdornment={
                    <InputAdornment position="end">
                    <IconButton onClick={handleSendMessage}>
                        <SendIcon sx={{ color: "white" }} />
                    </IconButton>
                    </InputAdornment>
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                inputProps={{ style: { color: "white" } }}
                />
            </FormControl>
        </div>
    </>
  )
}
