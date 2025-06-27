import React, { useEffect } from 'react'
import style from './Home.module.css';
import logo from '../assets/Chatnowlogo.png';
import { useNavigate } from 'react-router-dom';
// import {Test} from '../../context/context.js';
import { WebSocketContext } from '../../context/context.js';

import Cookies from 'js-cookie';

export default function Home() {
    const navigate = useNavigate();
    // const testContext = useContext(Test);

    useEffect(() => {
        setTimeout(() => {
            document.getElementById('logo').style.top = `calc(50vh - 100px)`
            console.log(document.getElementById('logo').style.height);
        }, 200);

      setTimeout(() => {
        let bg = document.getElementById('bg');
        bg.classList.add(style.expand);
        setTimeout(() => {
          if(Cookies.get("User")){
            navigate('/main')
          }
          else{
            navigate('/signin');
          }
        }, 1300);
      }, 600);
    }, [])

    // const handleTest = (e) => {
    //   testContext.current = testContext.current + 1;
    // }
    
  return (
    <>
        {/* <div>{testContext.current}</div>
        <button onClick={handleTest}>Hello</button> */}
        <div className={style.container}>
            <img className={style.logo} id = 'logo' src={logo} alt='NA'></img>
            <div id = "bg" className={style.bg}></div>
        </div>

        
    
    </>
  )
}
