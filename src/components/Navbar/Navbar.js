import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { Avatar, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
const Navbar = ({ name, setOpen, number }) => {
  console.log(number);
  const [avatarImg, setAvatarImg] = useState("");

  useEffect(() => {
    // fetch the avatar of selected chat user
    const getAvatarImage = async () => {
      const fetchedData = (await getDoc(doc(db, "Avatar", number))).data();
      setAvatarImg(fetchedData.avatar);
    };
    getAvatarImage();
  }, [number]);

  return (
    <>
      <div className={styles.container}>
        {/* avatar, name and number of selected chat user */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Avatar sx={{ backgroundColor: "#373737" }} src={avatarImg} />
          <div className={styles.name}>{name}</div>
          <span style={{ color: "#979797" }}>({number})</span>
        </div>

        {/* Button of edit selected user name, clear chat and deleted user */}
        <div>
          <IconButton
            onClick={() => {
              setOpen(true);
            }}
          >
            <EditIcon color="warning" />
          </IconButton>

        </div>
      </div>
    </>
  );
};
export default Navbar;
