import React, { useEffect, useState, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from '@mui/material/Divider';
import { TextField, Button, Autocomplete, Box, Chip } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { call_api } from "../../callwebservice";
import { CREATE_CHAT, GET_CONTACTS, SEARCH_USER } from '../../constants';
import Cookies from "js-cookie";
import {
  ChatsContext
} from "../../context/context.js";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#171717',
      paper: '#171717',
    },
  },
});


const style = {
  backgroundColor: "#171717",
  color: "#c7c7c7",
};


export default function AddGroupDialog({
  addChatDialogBoxOpen,
  handleAddGroupDialogClose,
  setAddChatDialogBoxOpen
}) {
  const [contactSelection, setContactSelection] = useState([]);
  const [searchContactSelection, setSearchContactSelection] = useState([]);
  
  const [contacts, setContacts] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [groupName, setGroupName] = useState("");
  // const { chats, setChats } = useContext(ChatsContext);

  useEffect(() => {
    (async () => {
      let url = `${GET_CONTACTS}`;
      let response = await call_api.get(url);

      console.log("fetch contacts response: ", response);

      if (response.status == 200 && response.data["status"] == "success") {
        let users = response.data["result"];
        setContacts(users);
        console.log("contacts: ", users);
      } else {
        setContacts([]);
      }
    })();
  }, []);


    
    // handle adding group
  const handleSearchUser = async () => {
    try {
      // Get the current user and user to be added details
      let payload = {
        "search": phoneNumber,
      };
      let response = await call_api.post(SEARCH_USER, payload);

      setPhoneNumber("");

      if (response.status == 400 || response.data["status"] != "success") {
        // If the user to be added doesn't exist then display error
        alert("User not found...");

      } else {
        let response_data = response.data['result'];
        setSearchContactSelection((prev) => [...prev, response_data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  
    // handle adding group
  const handleCreateGroupChat = async () => {
    try {
      // combine all the users and create chat
      let user_ids = new Set();

      let current_user = Cookies.get("User");
      current_user = JSON.parse(current_user);

      user_ids.add(Number(current_user['id']));

      contactSelection.map((element) => {
        user_ids.add(element['id']);
      });

      searchContactSelection.map((element) => {
        user_ids.add(element['id']);
      });

      let payload = {
        "chat_name": groupName,
        "user_ids": [...user_ids],
        "is_group_chat": true
      };
      
      let response = await call_api.post(CREATE_CHAT, payload);

      if (response.status == 200 && response.data["status"] === "success") {
        console.log("group created successfully");
      } else {
        console.log("error in group creation");
      }

      // empty all the fields
      setGroupName("");
      setSearchContactSelection([]);
      setContactSelection([]);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={addChatDialogBoxOpen} onClose={handleAddGroupDialogClose} sx = {{width: "50vw", margin: "auto"}}>
      <DialogTitle variant="h5" sx={style}>Add Group</DialogTitle>
      <DialogContent sx={style}>
        <ThemeProvider theme={darkTheme}>
          <TextField
            inputProps={{ style: { color: "#c7c7c7" } }}
            InputLabelProps={{ style: { color: "#c7c7c7" } }}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            margin="dense"
            id="name"
            label="Group Name *"
            type="text"
            fullWidth
            variant="outlined"
          />
        </ThemeProvider>

        <DialogContentText sx={{ fontSize: "large", color: "#c7c7c7", marginTop: "2rem" }}>
          Add Users
        </DialogContentText>

        <ThemeProvider theme={darkTheme}>
          <Autocomplete
            multiple
            value={contactSelection}
            onChange={(event, newEvent) => {
              setContactSelection([...newEvent]);
            }}
            id="tags-standard"
            options={contacts}
            getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
            sx = {{color: 'white', marginTop: "1rem"}}
            renderInput={(params) => (
              <TextField
                {...params}
                sx = {{color: 'white'}}
                variant="outlined"
                label="Select Contacts"
                placeholder="Contacts"
              />
            )}
          />
        </ThemeProvider>

        <ThemeProvider theme={darkTheme}>
          <DialogContentText sx={{color: "#c7c7c7", textAlign: 'center', marginY: "1rem"}}>
            <Divider>OR</Divider>
          </DialogContentText>
        </ThemeProvider>
        
        <DialogContentText sx={{ color: "#c7c7c7" }}>
          Enter the phone number or email of the user.
        </DialogContentText>
        <Box>
          {
            searchContactSelection.map((element, index) => {
              return (
                <Chip
                  label={`${element['first_name']} ${element['last_name']}`}
                  color="primary"
                  variant="outlined"
                  sx={{ margin: '0.25rem', color: "#a8a3ff" }}
                  onDelete={() => {setSearchContactSelection((prev) => prev.filter((ele) => ele['id'] !== element['id']))}}
                />
              )
            })
          }
        
        </Box>
        <ThemeProvider theme={darkTheme}>
          <TextField
            inputProps={{ style: { color: "#c7c7c7" } }}
            InputLabelProps={{ style: { color: "#c7c7c7" } }}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            margin="dense"
            id="name"
            label="Phone number / Email"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ marginTop: "1rem" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchUser();
              }
            }}
          />
        </ThemeProvider>
        <Button variant="outlined" color='success' size="small" onClick={handleSearchUser}>Search</Button>

      </DialogContent>
      <DialogActions sx={style}>
        <Button onClick={handleAddGroupDialogClose}>Cancel</Button>
        <Button onClick={handleCreateGroupChat}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
