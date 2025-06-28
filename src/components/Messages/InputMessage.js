import React from "react";
import styles from "./Messages.module.css";
import SendIcon from "@mui/icons-material/Send";
import AttachmentIcon from '@mui/icons-material/Attachment';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Chip from '@mui/material/Chip';
import { FILE_CHIP_NAME_LIMIT } from '../../constants'

import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";

export default function InputMessage({
  handleSendMessage,
  setMessage,
  message,
  handleAttachDoc,
  handleFileChange,
  fileRef,
  handleUnselectFile,
  attachedFile
}) {
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
                  {attachedFile != null ? 
                    <Chip
                      label={attachedFile['name'].length <= FILE_CHIP_NAME_LIMIT ? attachedFile['name'] : attachedFile['name'].slice(0, FILE_CHIP_NAME_LIMIT-3) + "..."}
                      sx = {{backgroundColor: "#1a1a1a"}}
                      variant="outlined"
                      color="info"
                      deleteIcon={<HighlightOffIcon/>}
                      onDelete={() => handleUnselectFile()}
                    /> 
                  : <></>}
                  <IconButton onClick={handleAttachDoc} >
                    <AttachmentIcon sx={{ color: "white" }}/>
                  </IconButton>
                  <input
                    type="file"
                    ref={fileRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
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
  );
}
