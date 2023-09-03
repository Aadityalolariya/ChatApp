import React, { useEffect } from 'react'
import style from './Home.module.css';
import logo from '../assets/Chatnowlogo.png';
import { useNavigate } from 'react-router-dom'
export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            document.getElementById('logo').style.top = `calc(50vh - 100px)`
            console.log(document.getElementById('logo').style.height);
        }, 200);
      setTimeout(() => {
        let bg = document.getElementById('bg');
        bg.classList.add(style.expand);
        setTimeout(() => {
          if(localStorage.getItem('user')){
            navigate('/main')
          }
          else{
            navigate('/signin');
          }
        }, 1300);
      }, 600);
    }, [])
    
  return (
    <>
        <div className={style.container}>
            <img className={style.logo} id = 'logo' src={logo} alt='NA'></img>
            <div id = "bg" className={style.bg}></div>
        </div>

        
    
    </>
  )
}
