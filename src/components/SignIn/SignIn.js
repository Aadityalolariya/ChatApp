import React, { useState } from "react";
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
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
const initialState = { fname: "", sname: "", password: "", number: "" };

export default function SignIn() {
  const [visible, setVisible] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [details, setDetails] = useState({ ...initialState });
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      if(details.number.length !== 10){
        alert('Please enter correct number!')
        return;
      }
      const result = await getDoc(doc(db, "Users", details.number));
      if (newUser) {
        // console.log("go in");
        if (result.exists()) {
          window.alert("User already present...");
          return;
        } else {
          console.log("go on");
          try {
            await setDoc(doc(db, "Users", details.number), {
              fname: details.fname,
              sname: details.sname,
              password: details.password,
              chats: [],
            });
            await setDoc(doc(db, 'Chats', details.number), {});
            await setDoc(doc(db, 'Avatar', details.number), {avatar : ''})
            window.localStorage.setItem(
              "user",
              `${details.number} ${details.fname} ${details.sname}`
            );
            setDetails(initialState);
            navigate('/main')
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        if (result.exists()) {
          const correctDetails = result.data();
          const correctPassword = correctDetails.password;
          if(correctPassword !== details.password){
            window.alert('Wrong credentials...');
            return;
          }
          console.log("Logged in");
          window.localStorage.setItem(
            "user",
            `${details.number} ${correctDetails.fname} ${correctDetails.sname}`
          );
          setDetails(initialState);
          navigate('/main')

        } else {
          window.alert("User not found!");
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


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
            onClick={handleSubmit}
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
