import React, { useEffect, useRef, useState, useContext } from "react";
import styles from "./SignIn.module.css";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { SIGN_UP_API, LOGIN_API } from '../../constants'
import { call_api } from '../../callwebservice';
import { useNavigate } from 'react-router-dom';
import { WebSocketContext, CurrentChatContext, MessagesContext, CurrentUserContext } from '../../context/context.js';
import Cookies from "js-cookie";

const initialState = { fname: "", sname: "", password: "", number: "" };

export default function SignIn() {
  const [visible, setVisible] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [details, setDetails] = useState({ ...initialState });
  const socketRef = useContext(WebSocketContext);
  const { currentChat, setCurrentChat } = useContext(CurrentChatContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const { currentUser, setcurrentUser } = useContext(CurrentUserContext);
  
  const navigate = useNavigate();

  useEffect(() => {
    if(Cookies.get("User") != null && Cookies.get("token") != null){
      navigate("/main");
    }
  }, [])
  

  const handleSubmit = async () => {
    console.log("In handle submit...")
    // for sign up request
    if(newUser){
      console.log("handle submit - new user...")
      if(details['fname'].length > 0 && details['sname'].length > 0  && details['password'].length > 0 &&  details['number'].length == 10){
        console.log("firing signup api for new user...")
        let params = {
          "password": details['password'],
          "first_name": details['fname'],
          "last_name": details['sname'],
          "phone_number": details['number']
        };
        let response = await call_api.post(SIGN_UP_API, params);
        console.log(response);
        if(response.status == 200 && response.data['status'] == 'success'){
          
          console.log("Successfully signed up:", response.data);
          let data = response.data['result']
          let token = data['token']
          Cookies.set("token", token)
          let User = {
            "id": data['id'],
            "first_name": data['first_name'],
            "last_name": data['last_name'],
            "phone_number": data['phone_number']
          }
          setcurrentUser(User);
          Cookies.set("User", JSON.stringify(User));

          socketRef.current = new WebSocket("ws://localhost:8000/ws?user_id=" + data['id']);

          socketRef.current.onopen = () => {
          console.log("✅ WebSocket connected");
          };

          socketRef.current.onerror = (err) => {
          console.error("❌ WebSocket error:", err);
          };

          socketRef.current.onclose = (e) => {
          console.log("🔌 WebSocket closed:", e.reason);
          };

          socketRef.current.onmessage = (e) => {
            let message = e.data;
            try{
              let decoded_message = JSON.parse(e.data);
              console.log("decoded_message: ", decoded_message);
              console.log(" currentChat: ", currentChat);
              let topic = decoded_message['topic'];
              let data = decoded_message['data'];
              if(topic == 'message_sent'){
                if(Number(currentChat['id']) == Number(data['chat_id'])){
                  setMessages((prev) => [...prev, data]);
                }
              }
            }
            catch(err) {
              console.log("error while decoding received message: ", err)
            }
          }
        }
        else{
          console.log("an error occurred")
        }
      }
    }
    else{
      let params = {
        "password": details['password'],
        "phone_number": details['number']
      };
      let response = await call_api.post(LOGIN_API, params);
      console.log(response);
      if(response.status == 200 && response.data['status'] == 'success'){
        console.log("Successfully signed up:", response.data);
        let data = response.data['result']
        let token = data['token']
        Cookies.set("token", token)
        let User = {
          "id": data['id'],
          "first_name": data['first_name'],
          "last_name": data['last_name'],
          "phone_number": data['phone_number']
        }
        setcurrentUser(User);
        Cookies.set("User", JSON.stringify(User));

        socketRef.current = new WebSocket("ws://localhost:8000/ws?user_id=" + data['id']);

        socketRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
        };

        socketRef.current.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        };

        socketRef.current.onclose = (e) => {
        console.log("🔌 WebSocket closed:", e.reason);
        };

        socketRef.current.onmessage = (e) => {
          let message = e.data;
          try{
            let decoded_message = JSON.parse(e.data);
            console.log("decoded_message: ", decoded_message);
            console.log(" currentChat: ", currentChat);
            let topic = decoded_message['topic'];
            let data = decoded_message['data'];
            if(topic == 'message_sent'){
              if(Number(currentChat['id']) == Number(data['chat_id'])){
                setMessages((prev) => [...prev, data]);
              }
            }
          }
          catch(err) {
            console.log("error while decoding received message: ", err)
          }
        }
      }
      else{
        console.log("an error occurred")
      }
    }

    if (Cookies.get("User") != null && Cookies.get("token") != null){
      navigate("/main");
    }
  }
  
  return (
    <>
      <div className={styles.container}>
        <Paper className={styles.form} elevation={9} component="div">
          <Typography variant="h4" sx={{ color: "white", textAlign: "center" }}>
            {newUser ? "Sign up" : "Welcome back"}
          </Typography>
          {newUser && (
            <div style={{ display: "flex", gap: "1rem" }}>
              <FormControl variant="outlined">
                <InputLabel htmlFor="fname" style={{ color: "gray" }}>
                  First name
                </InputLabel>

                <OutlinedInput
                  value={details.fname}
                  onChange={(e) =>
                    setDetails((prev) => ({ ...prev, fname: e.target.value }))
                  }
                  color="success"
                  inputProps={{ style: { color: "gray" } }}
                  type="text"
                  id="fname"
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircleIcon sx={{ color: "gray" }} />
                    </InputAdornment>
                  }
                  label="First name"
                />
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel htmlFor="sname" style={{ color: "gray" }}>
                  Second name
                </InputLabel>

                <OutlinedInput
                  value={details.sname}
                  onChange={(e) =>
                    setDetails((prev) => ({ ...prev, sname: e.target.value }))
                  }
                  color="success"
                  inputProps={{ style: { color: "gray" } }}
                  type="text"
                  id="sname"
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircleIcon sx={{ color: "gray" }} />
                    </InputAdornment>
                  }
                  label="Second name"
                />
              </FormControl>
            </div>
          )}
          <FormControl variant="outlined">
            <InputLabel htmlFor="number" style={{ color: "gray" }}>
              Mob. number
            </InputLabel>

            <OutlinedInput
              value={details.number}
              onChange={(e) =>
                setDetails((prev) => ({ ...prev, number: e.target.value }))
              }
              color="success"
              inputProps={{ style: { color: "gray" } }}
              type="tel"
              id="number"
              startAdornment={
                <InputAdornment position="start">
                  <CallIcon sx={{ color: "gray" }} />
                </InputAdornment>
              }
              label="Mob. number"
            />
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel htmlFor="password" style={{ color: "gray" }}>
              Password
            </InputLabel>
            <OutlinedInput
              value={details.password}
              onChange={(e) =>
                setDetails((prev) => ({ ...prev, password: e.target.value }))
              }
              autoComplete="none"
              color="success"
              inputProps={{ style: { color: "gray" } }}
              type={visible ? "text" : "password"}
              id="password"
              startAdornment={
                <InputAdornment position="start">
                  <VpnKeyIcon sx={{ color: "gray" }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setVisible((prev) => !prev);
                    }}
                  >
                    {visible ? (
                      <VisibilityOffIcon sx={{ color: "gray" }} />
                    ) : (
                      <VisibilityIcon sx={{ color: "gray" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <Button
            color="info"
            fullWidth
            variant="outlined"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>

          <div style={{ textAlign: "center", color: "white" }}>
            <span>{newUser ? "Already user ?" : "Don`t have account?"}</span>
            <Button
              sx={{ textTransform: "none" }}
              onClick={() => setNewUser((prev) => !prev)}
            >
              {newUser ? "Login" : "Create account"}
            </Button>
          </div>
        </Paper>
      </div>
    </>
  );
}
